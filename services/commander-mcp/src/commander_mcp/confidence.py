"""
Confidence reporting.

Per the project principle: the agent must NEVER confidently suggest something wrong.
Every tool response wraps its payload in a Confidence envelope so the LLM can see
the certainty of the data it's reasoning over.

Bands:
  - certain   : authoritative source (Scryfall card data, Oracle text, comp rules)
  - high      : sourced + recently verified; minor staleness possible
  - moderate  : derived from authoritative data + heuristic (e.g. synergy score)
  - low       : learned weights with little corroborating data
  - unknown   : no source; the agent should refuse to assert
"""

from __future__ import annotations

from enum import Enum
from typing import Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class Band(str, Enum):
    CERTAIN = "certain"
    HIGH = "high"
    MODERATE = "moderate"
    LOW = "low"
    UNKNOWN = "unknown"


class Confidence(BaseModel, Generic[T]):
    band: Band
    data: T | None
    sources: list[str] = []
    caveats: list[str] = []

    @classmethod
    def certain(cls, data: T, sources: list[str]) -> "Confidence[T]":
        return cls(band=Band.CERTAIN, data=data, sources=sources)

    @classmethod
    def unknown(cls, caveat: str) -> "Confidence[T]":
        return cls(band=Band.UNKNOWN, data=None, caveats=[caveat])
