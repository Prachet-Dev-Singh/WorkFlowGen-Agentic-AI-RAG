🤖 WorkFlowGen: Agentic AI Analyst

<div align="center">

A Full-Stack Agentic RAG Platform for Intelligent Document Analysis

<p align="center">
<a href="#-key-features">Key Features</a> •
<a href="#-tech-stack">Tech Stack</a> •
<a href="#-architecture">Architecture</a> •
<a href="#-local-installation-guide">Installation</a> •
<a href="#-how-to-use">Usage</a>
</p>

</div>

WorkFlowGen moves beyond traditional chatbots by implementing a Semantic Router powered by Google Gemini 2.0 Flash. It intelligently classifies user intent (QA vs. Summarization) and routes requests to specialized agents using a LangGraph State Machine.

🚀 Key Features

Feature

Description

🧠 Agentic Workflow

Replaces linear logic with a cyclic LangGraph state machine for decision-making.

🎯 Semantic Routing

Uses structured JSON output to distinguish between "help/critique" (QA) and "overview" (Summary) requests without brittle keywords.

⚡ Structured Output

Enforces strict JSON schemas on the LLM to prevent routing errors and hallucinations.

🔍 Smart Retrieval

Uses pgvector for similarity search to fetch precise context from documents.

📄 Async Ingestion

Handles PDF/Text parsing and vectorization asynchronously using FastAPI.

📊 Modern UI

Real-time, responsive dashboard built with Next.js 16, Tailwind CSS, and Lucide Icons.

🛠️ Tech Stack

<div align="center">

Frontend

Backend

Data & AI

Deployment

</div>

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


💻 Local Installation Guide

Follow these steps to run the full agentic stack on your local machine.

1. Prerequisites

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
