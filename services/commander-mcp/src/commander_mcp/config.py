"""Runtime configuration. Loaded from environment / .env."""

from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="CMC_", extra="ignore")

    # Scryfall API
    scryfall_base_url: str = "https://api.scryfall.com"
    scryfall_user_agent: str = "CommanderCollector/0.1 (contact: rickwphillips)"
    scryfall_rate_limit_ms: int = 100  # Scryfall asks for 50-100ms between calls

    # Local cache / learning DB
    db_path: Path = Path("./data/commander_mcp.sqlite")

    # Comprehensive Rules text file (downloaded from WotC)
    rules_path: Path = Path("./data/MagicCompRules.txt")

    # Daily crawl
    crawl_enabled: bool = False  # the CLI ignores this; reserved for future scheduling logic
    crawl_sources: list[str] = ["archidekt", "edhrec"]

    # HTTP transport (used when server.py is launched with --http)
    http_host: str = "127.0.0.1"
    http_port: int = 8001


settings = Settings()
