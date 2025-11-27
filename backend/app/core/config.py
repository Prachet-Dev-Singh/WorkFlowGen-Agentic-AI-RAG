from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "WorkFlowGen"
    DATABASE_URL: str
    GEMINI_API_KEY: str # <--- Changed from OPENAI_API_KEY

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()