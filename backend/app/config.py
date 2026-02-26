from functools import lru_cache
from pydantic import BaseModel
from dotenv import load_dotenv
import os


class Settings(BaseModel):
    openai_api_key: str | None = None
    google_api_key: str | None = None
    youtube_api_key: str | None = None
    supabase_url: str | None = None
    supabase_key: str | None = None
    pexels_api_key: str | None = None
    news_api_key: str | None = None
    exchange_api_key: str | None = None
    frontend_origin: str = "http://localhost:5173"


@lru_cache
def get_settings() -> Settings:
    # Load environment variables from .env if present
    load_dotenv()
    return Settings(
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        youtube_api_key=os.getenv("YOUTUBE_API_KEY"),
        supabase_url=os.getenv("SUPABASE_URL"),
        supabase_key=os.getenv("SUPABASE_KEY"),
        pexels_api_key=os.getenv("PEXELS_API_KEY"),
        news_api_key=os.getenv("NEWS_API_KEY"),
        exchange_api_key=os.getenv("EXCHANGE_API_KEY"),
        frontend_origin=os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
    )

