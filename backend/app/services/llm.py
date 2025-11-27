import google.generativeai as genai
from app.core.config import settings

# 1. Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

async def get_embedding(text: str):
    """
    Get embeddings using Gemini (text-embedding-004)
    Output dimension: 768
    """
    # Gemini prefers simple text, clean up newlines
    clean_text = text.replace("\n", " ")
    
    # Call the API
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=clean_text,
        task_type="retrieval_document",
        title="Embedded Document"
    )
    
    # Return the list of numbers (vectors)
    return result['embedding']

async def get_answer(context: str, question: str):
    """
    Generate answer using Gemini Pro (Stable version)
    """
    # CHANGED: 'gemini-1.5-flash' -> 'gemini-pro'
    model = genai.GenerativeModel('models/gemini-2.0-flash') 
    
    prompt = f"""
    You are a helpful assistant. Use the following context to answer the question.
    
    Context:
    {context}
    
    Question: {question}
    """
    
    response = model.generate_content(prompt)
    return response.text    

# Add this function to the file
async def get_summary(context: str):
    model = genai.GenerativeModel('models/gemini-2.0-flash')
    prompt = f"""
    Analyze the following text and provide a concise, professional summary.
    Extract key points, dates, and action items if any.

    Text:
    {context[:10000]}  # Limit text to avoid hitting limits
    """
    response = model.generate_content(prompt)
    return response.text