import asyncio
from app.core.db import engine, Base
from app.models.document import Document, DocumentChunk

async def init_models():
    async with engine.begin() as conn:
        # 1. Enable the vector extension (just in case)
        await conn.execute(sqlalchemy.text("CREATE EXTENSION IF NOT EXISTS vector"))
        
        # 2. Reset tables (Drop old ones if they exist, create new ones)
        # WARNING: This deletes data every time you run it. Good for dev, bad for prod.
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        
    print("✅ Tables created successfully!")

if __name__ == "__main__":
    import sqlalchemy
    asyncio.run(init_models())