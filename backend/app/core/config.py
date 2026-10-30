import os
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RAGHire"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "raghire-super-secret-jwt-key-2026-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database (Defaults to SQLite for instant out-of-the-box local running)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./raghire.db"
    )
    
    # Uploads
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    MAX_UPLOAD_SIZE_MB: int = 15
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".txt"]
    
    # LLM & AI Service Settings
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "mock") # "gemini", "openai", "ollama", "mock"
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    
    # Code Execution Settings (Judge0)
    JUDGE0_API_URL: str = os.getenv("JUDGE0_API_URL", "https://judge0-ce.p.rapidapi.com")
    JUDGE0_API_KEY: Optional[str] = os.getenv("JUDGE0_API_KEY", None)
    JUDGE0_API_HOST: str = os.getenv("JUDGE0_API_HOST", "judge0-ce.p.rapidapi.com")
    
    # Demo Mode Flag
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
