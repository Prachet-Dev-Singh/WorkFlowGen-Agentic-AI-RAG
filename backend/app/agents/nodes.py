import json
import typing_extensions as typing
import google.generativeai as genai
from app.agents.state import AgentState
from sqlalchemy import select
from app.models.document import DocumentChunk
from app.core.db import SessionLocal

# --- WORKER 1: THE ROUTER (SEMANTIC & STRUCTURED) ---
# We define the strict form the AI must fill out
class RouterDecision(typing.TypedDict):
    category: str
    reasoning: str

async def route_query(state: AgentState):
    print("--- 🚦 SEMANTIC ROUTER STARTED ---")
    model = genai.GenerativeModel('models/gemini-2.0-flash')
    
    # Semantic definitions instead of simple keywords
    prompt = f"""
    You are an intelligent workflow router. Your job is to classify the user's intent based on their meaning.
    
    User Query: "{state['question']}"
    
    Analyze the query and assign it to one of these two agents:
    
    1. "summary": Use this for requests asking to condense, shorten, overview, capture main points, or "TL;DR".
    2. "qa": Use this for specific questions, factual lookups, reasoning, advice, critiques, improvements, or "how-to".
    
    Output the category ("summary" or "qa") and your reasoning.
    """
    
    # Force JSON output using Structured Generation
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=RouterDecision
        )
    )
    
    try:
        decision_data = json.loads(response.text)
        category = decision_data["category"].lower()
        reasoning = decision_data["reasoning"]
        
        print(f"--- 🧭 AI DECISION: {category.upper()} ---")
        print(f"--- 💭 AI REASONING: {reasoning} ---")
        
        if "summary" in category:
            return {"intent": "summary"}
        else:
            return {"intent": "qa"}
            
    except Exception as e:
        print(f"Router Error: {e}, defaulting to QA")
        return {"intent": "qa"}

# --- WORKER 2: THE RETRIEVER ---
# Searches the database for relevant chunks
async def retrieve_documents(state: AgentState):
    print("--- 🔍 RETRIEVER NODE STARTED ---")
    # We need a new DB session here because this runs outside the API route
    async with SessionLocal() as db:
        model = genai.GenerativeModel('models/text-embedding-004')
        embedding = genai.embed_content(
            model="models/text-embedding-004",
            content=state['question'],
            task_type="retrieval_query"
        )['embedding']
        
        # Search DB
        stmt = select(DocumentChunk).order_by(
            DocumentChunk.embedding.cosine_distance(embedding)
        ).limit(5)
        
        result = await db.execute(stmt)
        chunks = result.scalars().all()
        
        context = "\n\n".join([c.chunk_text for c in chunks])
        return {"context": context}

# --- WORKER 3: THE GENERATOR (QA) ---
async def generate_answer(state: AgentState):
    print("--- 💡 QA GENERATOR NODE STARTED ---")
    model = genai.GenerativeModel('models/gemini-2.0-flash')
    prompt = f"""
    Answer the question based ONLY on the context below.
    Context: {state['context']}
    Question: {state['question']}
    """
    response = model.generate_content(prompt)
    return {"answer": response.text}

# --- WORKER 4: THE SUMMARIZER ---
async def generate_summary(state: AgentState):
    print("--- 📝 SUMMARY GENERATOR NODE STARTED ---")
    model = genai.GenerativeModel('models/gemini-2.0-flash')
    prompt = f"""
    Provide a professional summary of the following information:
    {state['context']}
    """
    response = model.generate_content(prompt)
    return {"answer": "📝 **Agent Auto-Summary:**\n" + response.text}