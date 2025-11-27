🤖 WorkFlowGen: Agentic AI Analyst

WorkFlowGen is a full-stack Agentic RAG (Retrieval Augmented Generation) platform designed to intelligently analyze, summarize, and extract insights from documents.

Unlike traditional chatbots, WorkFlowGen uses a Semantic Router powered by Google Gemini 2.0 Flash to understand user intent (QA vs. Summarization) and routes requests to specialized agents using LangGraph.

<div align="center">

</div>

🚀 Key Features

🧠 Agentic Workflow: Replaces linear logic with a LangGraph State Machine.

Router Agent: Uses structured output (JSON) to semantically classify user intent.

Retriever Node: Fetches relevant context using pgvector similarity search.

Specialized Workers: Separate agents for detailed QA and professional summarization.

🎯 Semantic Routing: Intelligently distinguishes between "asking for help/critique" and "asking for a summary" without relying on brittle keywords.

⚡ Structured Output: Enforces strict JSON schemas on the LLM to prevent routing errors and hallucinations.

📄 Document Ingestion: Asynchronous pipeline for parsing and vectorizing text/PDF files.

📊 Modern Dashboard: Real-time UI built with Next.js 16, Tailwind CSS, and Lucide React.

🏗️ Architecture

The system follows a cyclic graph architecture rather than a linear chain:

flowchart TD
    User[User Input] --> API[FastAPI Endpoint]
    API --> Graph{LangGraph Workflow}
    
    subgraph "Agent Brain"
    Graph --> Retriever[🔍 Retriever Node]
    Retriever -->|Context + Query| Router[🚦 Semantic Router]
    
    Router -->|Intent: QA| QA_Gen[💡 QA Generator]
    Router -->|Intent: SUMMARY| Sum_Gen[📝 Summary Generator]
    end
    
    QA_Gen --> Output[Final Response]
    Sum_Gen --> Output


🛠️ Tech Stack

AI & Orchestration

Orchestration: LangGraph (State Machine)

LLM: Google Gemini 2.0 Flash (google-generativeai)

Routing: Semantic classification via Structured Generation (JSON mode)

Backend

Framework: FastAPI (Python 3.10+)

Database: PostgreSQL 16

Vector Search: pgvector

ORM: SQLAlchemy (Async)

Frontend

Framework: Next.js 16 (App Router)

Styling: Tailwind CSS

State: React Hooks + Axios

Deployment

Frontend: Vercel

Backend: Render

Database: Supabase

💻 Local Installation Guide

Follow these steps to run the full agentic stack on your local machine.

1. Prerequisites

Ensure you have the following installed:

Docker Desktop (For the database)

Python 3.10+

Node.js 18+

2. Clone the Repository

git clone [https://github.com/Prachet-Dev-Singh/WorkFlowGen.git](https://github.com/Prachet-Dev-Singh/WorkFlowGen.git)
cd WorkFlowGen


3. Database Setup (Docker)

We use Docker to spin up a PostgreSQL instance with the pgvector extension pre-installed.

docker compose -f infra/docker-compose.yml up -d


Verify it's running: docker ps

4. Backend Setup

Navigate to the backend folder and set up the Python environment.

cd backend

# Create virtual environment
python -m venv venv

# Activate it
source venv/Scripts/activate  # Windows (Git Bash)
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt


Configure Environment Variables:
Create a .env file inside the backend folder:

touch .env


Open .env and paste the following (Replace YOUR_KEY with your Google Gemini API Key):

# Local Docker Database
DATABASE_URL=postgresql+asyncpg://admin:password123@localhost:5432/workflowgen_db

# Get your free key from [https://aistudio.google.com/](https://aistudio.google.com/)
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE


Initialize the Database Tables:

python init_db.py
# Output should say: ✅ Tables created successfully!


Start the Server:

uvicorn app.main:app --reload


The Backend is now running on: http://localhost:8000

5. Frontend Setup

Open a new terminal window and navigate to the frontend.

cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev


The Frontend is now running on: http://localhost:3000

🧪 How to Use

Open http://localhost:3000 in your browser.

Upload: Use the left panel to upload a PDF or text file.

Test the Router:

Ask: "Summarize this document." -> The Router will send this to the Summary Agent.

Ask: "How can I improve this email?" -> The Router will send this to the QA/Critique Agent.

Observe: Watch the backend terminal logs to see the Agent's "Thinking Process" and routing decisions in real-time.

🤝 Contributing

Contributions are welcome! Please fork the repo and submit a Pull Request.

📄 License

This project is licensed under the MIT License.
