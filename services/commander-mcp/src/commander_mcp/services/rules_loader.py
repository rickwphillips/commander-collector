"""
Comprehensive Rules loader.

Two responsibilities:
  1. Download the current MagicCompRules.txt from Wizards (or read from disk).
  2. Parse the text into structured records (sections, rules, glossary, metadata).

The CR text format is stable across releases:

    <BOM>Magic: The Gathering Comprehensive Rules
    These rules are effective as of <date>.
    Introduction
    ...prose...
    Contents
        1. Game Concepts
            100. General
            101. The Magic Golden Rules
            ...
    1. Game Concepts            <-- body starts here (chapter header repeats)
    100. General
    100.1. <rule body>
    100.1a <subrule body>
        Example: <example body>
    ...
    Glossary
    <term>
    <definition>
    <blank line>
    <term>
    <definition>
    ...
    Credits
    <attribution>
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable


# --- Regex patterns ----------------------------------------------------------
# Chapters use a single digit. The body restarts each chapter title.
_CHAPTER_RE = re.compile(r"^(\d)\.\s+([A-Z].+)$")
# Sections use three digits.
_SECTION_RE = re.compile(r"^(\d{3})\.\s+(.+)$")
# Top-level rules: "100.1. <body>"
_RULE_RE = re.compile(r"^(\d{3})\.(\d+)\.\s+(.+)$")
# Subrules: "100.1a <body>" (one or more lowercase letters, no period after)
_SUBRULE_RE = re.compile(r"^(\d{3})\.(\d+)([a-z]+)\s+(.+)$")
_EXAMPLE_PREFIX = "Example:"


# --- Data classes ------------------------------------------------------------
@dataclass
class CRSection:
    number: str
    chapter: str
    title: str


@dataclass
class CRRule:
    rule_number: str
    section: str
    parent: str | None
    body: str
    examples: list[str] = field(default_factory=list)


@dataclass
class CRGlossaryEntry:
    term: str
    definition: str


@dataclass
class ParsedRules:
    metadata: dict[str, str]
    sections: list[CRSection]
    rules: list[CRRule]
    glossary: list[CRGlossaryEntry]


# --- Parser ------------------------------------------------------------------
class CRParser:
    """Stateful line-driven parser. One pass, linear time."""

    def __init__(self) -> None:
        self._state: str = "header"
        self._chapter: tuple[str, str] | None = None
        self._sections: dict[str, CRSection] = {}
        self._rules: list[CRRule] = []
        self._glossary_buffer: list[str] = []
        self._metadata: dict[str, str] = {}
        # Active rule under construction:
        self._cur_rule: CRRule | None = None
        # The body starts when we see the first real rule (RULE_RE/SUBRULE_RE).
        # Before that, lines like "Glossary" and "Credits" are TOC entries,
        # not state transitions.
        self._body_started: bool = False

    def parse(self, text: str) -> ParsedRules:
        # Normalize: strip BOM, normalize newlines.
        text = text.lstrip("\ufeff").replace("\r\n", "\n").replace("\r", "\n")

        for raw in text.split("\n"):
            line = raw.rstrip()
            self._consume(line)

        self._flush_rule()
        glossary = self._finalize_glossary()

        return ParsedRules(
            metadata=self._metadata,
            sections=list(self._sections.values()),
            rules=self._rules,
            glossary=glossary,
        )

    # -- per-line dispatch ----------------------------------------------------
    def _consume(self, line: str) -> None:
        # Capture effective date once, wherever it appears.
        if line.startswith("These rules are effective as of"):
            m = re.search(r"as of (.+?)\.", line)
            if m:
                self._metadata["effective_date"] = m.group(1)

        # State transitions on bare delimiters — but ONLY once the body has
        # started. Both "Glossary" and "Credits" appear in the Contents listing
        # at the top of the file, where they are TOC entries, not delimiters.
        if line == "Glossary" and self._body_started:
            self._flush_rule()
            self._state = "glossary"
            return
        if line == "Credits" and self._body_started:
            self._state = "credits"
            return

        if self._state == "credits":
            return  # we don't store credits content

        if self._state == "glossary":
            self._glossary_buffer.append(line)
            return

        # Otherwise we are in header / contents / body — all share rule logic.
        self._consume_body(line)

    def _consume_body(self, line: str) -> None:
        if not line:
            return  # blank lines just terminate the current text run

        # Chapter header (e.g. "1. Game Concepts")
        m = _CHAPTER_RE.match(line)
        if m and len(m.group(1)) == 1:
            self._flush_rule()
            self._chapter = (m.group(1), m.group(2).strip())
            return

        # Section header (e.g. "100. General")
        m = _SECTION_RE.match(line)
        if m:
            num = m.group(1)
            title = m.group(2).strip()
            chapter = self._chapter[0] if self._chapter else num[0]
            # Idempotent: contents and body both produce the same section line.
            self._sections[num] = CRSection(number=num, chapter=chapter, title=title)
            self._flush_rule()
            return

        # Subrule (e.g. "100.1a A two-player game is...")
        # Check BEFORE rule, since both start with the same prefix.
        m = _SUBRULE_RE.match(line)
        if m:
            self._flush_rule()
            parent = f"{m.group(1)}.{m.group(2)}"
            self._cur_rule = CRRule(
                rule_number=f"{parent}{m.group(3)}",
                section=m.group(1),
                parent=parent,
                body=m.group(4).strip(),
            )
            self._body_started = True
            return

        # Top-level rule (e.g. "100.1. These Magic rules...")
        m = _RULE_RE.match(line)
        if m:
            self._flush_rule()
            self._cur_rule = CRRule(
                rule_number=f"{m.group(1)}.{m.group(2)}",
                section=m.group(1),
                parent=None,
                body=m.group(3).strip(),
            )
            self._body_started = True
            return

        # Continuation of the active rule.
        if self._cur_rule is not None:
            stripped = line.strip()
            if stripped.startswith(_EXAMPLE_PREFIX):
                self._cur_rule.examples.append(stripped[len(_EXAMPLE_PREFIX):].strip())
            elif self._cur_rule.examples:
                self._cur_rule.examples[-1] = (
                    self._cur_rule.examples[-1] + " " + stripped
                ).strip()
            else:
                self._cur_rule.body = (self._cur_rule.body + " " + stripped).strip()

    def _flush_rule(self) -> None:
        if self._cur_rule is not None:
            self._rules.append(self._cur_rule)
            self._cur_rule = None

    def _finalize_glossary(self) -> list[CRGlossaryEntry]:
        """Split the buffered glossary on blank lines; first line is term, rest definition."""
        entries: list[CRGlossaryEntry] = []
        # Drop empty leading/trailing lines, group by blank-line separators.
        chunk: list[str] = []
        for line in self._glossary_buffer:
            if line.strip() == "":
                if chunk:
                    entries.append(_entry_from_chunk(chunk))
                    chunk = []
            else:
                chunk.append(line)
        if chunk:
            entries.append(_entry_from_chunk(chunk))
        # Some chunks might be malformed (single line, no definition); drop them.
        return [e for e in entries if e.definition.strip()]


def _entry_from_chunk(chunk: list[str]) -> CRGlossaryEntry:
    term = chunk[0].strip()
    definition = " ".join(line.strip() for line in chunk[1:]).strip()
    return CRGlossaryEntry(term=term, definition=definition)


# --- Filesystem / network helpers --------------------------------------------
def load_rules_from_path(path: Path) -> ParsedRules:
    """Read MagicCompRules.txt from disk and parse."""
    text = path.read_text(encoding="utf-8")
    return CRParser().parse(text)


async def download_rules(url: str, dest: Path) -> Path:
    """Fetch the CR text file and write it to `dest`. Returns the dest path."""
    import httpx

    dest.parent.mkdir(parents=True, exist_ok=True)
    async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        dest.write_bytes(resp.content)
    return dest
