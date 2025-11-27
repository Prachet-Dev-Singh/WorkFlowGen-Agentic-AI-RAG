from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.db import get_db
from app.models.document import Document, DocumentChunk
from app.schemas import DocumentResponse, QARequest, QAResponse
from app.services.llm import get_embedding, get_answer
from app.schemas import DocumentResponse, QARequest, QAResponse, SummaryRequest, SummaryResponse
from app.services.llm import get_embedding, get_answer, get_summary

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    # 1. Read the file
    content = await file.read()
    try:
        text_content = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a UTF-8 text file.")

    # 2. Save the Parent Document
    new_doc = Document(title=file.filename, content=text_content)
    db.add(new_doc)
    await db.commit()
    await db.refresh(new_doc)

    # 3. Simple Chunking (Split by every 1000 characters)
    # In a real app, we would use a smarter splitter.
    chunk_size = 1000
    chunks = [text_content[i:i+chunk_size] for i in range(0, len(text_content), chunk_size)]

    # 4. Process Chunks (Generate Embeddings)
    for index, chunk_text in enumerate(chunks):
        if not chunk_text.strip():
            continue # Skip empty chunks
            
        vector = await get_embedding(chunk_text)
        
        new_chunk = DocumentChunk(
            document_id=new_doc.id,
            chunk_index=index,
            chunk_text=chunk_text,
            embedding=vector
        )
        db.add(new_chunk)
    
    await db.commit()
    await db.refresh(new_doc)
    return new_doc

@router.post("/qa", response_model=QAResponse)
async def ask_question(request: QARequest, db: AsyncSession = Depends(get_db)):
    # 1. Convert User Question to Vector
    question_vector = await get_embedding(request.question)

    # 2. Find the 3 most similar chunks in the DB
    # We use the Cosine Distance operator (<=>) provided by pgvector
    stmt = select(DocumentChunk).order_by(
        DocumentChunk.embedding.cosine_distance(question_vector)
    ).limit(3)
    
    result = await db.execute(stmt)
    top_chunks = result.scalars().all()

    if not top_chunks:
        return QAResponse(answer="I couldn't find any relevant information in the documents.", sources=[])

    # 3. Combine chunks into one block of text
    context_text = "\n\n".join([chunk.chunk_text for chunk in top_chunks])

    # 4. Send to GPT to generate the answer
    answer = await get_answer(context_text, request.question)

    return QAResponse(
        answer=answer,
        sources=[chunk.chunk_text[:100] + "..." for chunk in top_chunks]
    )

@router.get("/documents", response_model=list[DocumentResponse])
async def list_documents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document))
    return result.scalars().all()

@router.post("/summarize", response_model=SummaryResponse)
async def summarize_document(request: SummaryRequest, db: AsyncSession = Depends(get_db)):
    # Get all chunks for this document
    stmt = select(DocumentChunk).where(DocumentChunk.document_id == request.document_id).order_by(DocumentChunk.chunk_index)
    result = await db.execute(stmt)
    chunks = result.scalars().all()

    if not chunks:
         raise HTTPException(status_code=404, detail="Document not found")

    # Combine text
    full_text = "\n".join([c.chunk_text for c in chunks])

    # Call AI
    summary = await get_summary(full_text)

    return SummaryResponse(summary=summary)