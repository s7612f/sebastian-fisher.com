from functools import lru_cache
from typing import List, Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Chronos Health"
    environment: str = "development"
    secret_key: str = Field("super-secret-key", env="SECRET_KEY")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    database_url: str = Field("postgresql://chronos:chronos@db:5432/chronos", env="DATABASE_URL")
    enable_encrypted_db: bool = False
    allowed_origins: List[str] = ["*"]
    smtp_host: Optional[str] = None
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_port: int = 587
    smtp_from: Optional[str] = None
    enable_ollama: bool = True
    ollama_host: str = "http://ollama:11434"
    ai_model: str = "gemma2:9b"
    backup_backend: str = "local"
    backup_folder: str = "/data/backups"
    backup_rclone_remote: Optional[str] = None
    dexcom_api_key: Optional[str] = None
    tandem_api_key: Optional[str] = None
    oura_client_id: Optional[str] = None
    oura_client_secret: Optional[str] = None
    fitbit_client_id: Optional[str] = None
    fitbit_client_secret: Optional[str] = None


@lru_cache()
def get_settings() -> Settings:
    return Settings()
