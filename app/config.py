from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Craft Castle"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str                  # anon/public key
    SUPABASE_SERVICE_KEY: str          # service role key (for admin ops)
    SUPABASE_STORAGE_BUCKET: str = "craft-castle-media"

    # JWT Auth
    SECRET_KEY: str                    # random secret, e.g. openssl rand -hex 32
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Admin credentials (simple single admin for now)
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str                # hashed password stored here

    # WhatsApp
    WHATSAPP_NUMBER: str               # e.g. 919876543210 (country code + number)

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
