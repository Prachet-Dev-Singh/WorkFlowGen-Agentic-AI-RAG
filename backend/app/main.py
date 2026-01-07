from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # <--- NEW IMPORT
from app.core.config import settings
from app.api import routes

app = FastAPI(title=settings.PROJECT_NAME)

# --- NEW: ALLOW FRONTEND TO TALK TO BACKEND ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow the Next.js app
    allow_credentials=False,
    allow_methods=["*"], # Allow all methods (POST, GET, etc)
    allow_headers=["*"], # Allow all headers
)
# ----------------------------------------------

app.include_router(routes.router, prefix="/api")

@app.get("/")
async def root():
    return {"status": "ok", "message": "WorkFlowGen API is running"}
