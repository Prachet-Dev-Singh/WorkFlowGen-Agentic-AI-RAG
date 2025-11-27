from pydantic import BaseModel
from datetime import datetime

# Response model for uploading/listing docs
class DocumentResponse(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True

# Request model for asking a question (Input)
class QARequest(BaseModel):
    question: str

# Response model for the answer (Output)
class QAResponse(BaseModel):
    answer: str
    sources: list[str]

# Add these at the bottom
class SummaryRequest(BaseModel):
    document_id: int

class SummaryResponse(BaseModel):
    summary: str