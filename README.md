# 🤖 WorkFlowGen: Agentic AI Analyst

<div align="center">

### A Full-Stack Agentic RAG Platform for Intelligent Document Analysis

<p align="center">
<a href="#-key-features">Key Features</a> •
<a href="#-tech-stack">Tech Stack</a> •
<a href="#-architecture">Architecture</a> •
<a href="#-local-installation-guide">Installation</a> •
<a href="#-how-to-use">Usage</a>
</p>

</div>

WorkFlowGen moves beyond traditional chatbots by implementing a **Semantic Router** powered by **Google Gemini 2.0 Flash**.  
It intelligently classifies user intent (QA vs. Summarization) and routes requests to specialized agents using a **LangGraph State Machine**.

---

## 🚀 Key Features

| Feature | Description |
|----------|-------------|
| 🧠 **Agentic Workflow** | Replaces linear logic with a cyclic LangGraph state machine for decision-making. |
| 🎯 **Semantic Routing** | Uses structured JSON output to distinguish between "help/critique" (QA) and "overview" (Summary) requests without brittle keywords. |
| ⚡ **Structured Output** | Enforces strict JSON schemas on the LLM to prevent routing errors and hallucinations. |
| 🔍 **Smart Retrieval** | Uses pgvector for similarity search to fetch precise context from documents. |
| 📄 **Async Ingestion** | Handles PDF/Text parsing and vectorization asynchronously using FastAPI. |
| 📊 **Modern UI** | Real-time, responsive dashboard built with Next.js 16, Tailwind CSS, and Lucide Icons. |

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Data & AI | Deployment |
|-----------|----------|------------|-------------|
| Next.js 16, Tailwind CSS, Lucide Icons | FastAPI, LangGraph | pgvector, Google Gemini 2.0 Flash | Docker, PostgreSQL |

</div>

---

## 🏗️ Architecture

The system follows a **cyclic graph architecture** rather than a linear chain:

```mermaid
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

---

## 💻 Local Installation Guide

Follow these steps to set up and run the **WorkFlowGen Agentic Stack** on your local machine.

---

### 🧩 1. Prerequisites

Before installation, make sure you have the following:

| Tool | Version | Purpose |
|------|----------|----------|
| 🐳 **Docker Desktop** | Latest | To run PostgreSQL (with `pgvector`) |
| 🐍 **Python** | 3.10+ | Backend (FastAPI + LangGraph) |
| 💚 **Node.js** | 18+ | Frontend (Next.js 16 + Tailwind CSS) |

---

### 📥 2. Clone the Repository

git clone https://github.com/Prachet-Dev-Singh/WorkFlowGen.git  
cd WorkFlowGen

---

### 🗃️ 3. Database Setup (PostgreSQL + pgvector via Docker)

Spin up the database container:

docker compose -f infra/docker-compose.yml up -d

✅ Verify that your database is running:

docker ps

This launches a PostgreSQL instance with **pgvector** extension pre-installed for efficient semantic search.

---

### ⚙️ 4. Backend Setup (FastAPI + LangGraph)

Navigate to the backend directory and create a virtual environment:

cd backend  
python -m venv venv  

Activate the environment:  
- **Windows (Git Bash):** `source venv/Scripts/activate`  
- **Mac/Linux:** `source venv/bin/activate`

Install dependencies:  
pip install -r requirements.txt

#### 🔑 Configure Environment Variables

Create a `.env` file inside the `backend` folder:

touch .env

Paste the following and replace `YOUR_GEMINI_API_KEY_HERE`:

```env
# Local Docker Database
DATABASE_URL=postgresql+asyncpg://admin:password123@localhost:5432/workflowgen_db

# Google Gemini API Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE



#### 🗄️ Initialize the Database Schema

python init_db.py  
✅ Tables created successfully!

#### 🚀 Start the Backend Server

uvicorn app.main:app --reload  

Backend runs on → **http://localhost:8000**

---

### 🎨 5. Frontend Setup (Next.js + Tailwind CSS)

Open a **new terminal** and navigate to the frontend directory:

cd frontend  
npm install  
npm run dev  

Frontend runs on → **http://localhost:3000**

---

### 🧪 6. Testing the Application

1. Open **http://localhost:3000** in your browser.  
2. Upload a document (PDF or text) using the **left upload panel**.  
3. Try different queries:
   - 📝 *“Summarize this document.”* → Routed to Summary Agent  
   - 💬 *“How can I improve this email?”* → Routed to QA/Critique Agent  
4. Observe the **backend terminal logs** for real-time routing and reasoning steps.

---

### 🧹 7. Stopping the Containers

When done, stop Docker containers safely:

docker compose -f infra/docker-compose.yml down

---

### 🧰 Quick Recap

| Component | Tech | Port | Description |
|------------|------|------|-------------|
| 🧠 Backend | FastAPI + LangGraph | `8000` | Handles semantic routing and agent logic |
| 🖥️ Frontend | Next.js + Tailwind | `3000` | Interactive UI for document upload and analysis |
| 🗃️ Database | PostgreSQL + pgvector | `5432` | Vector similarity storage |

---

🎉 **You’re all set!**  
WorkFlowGen is now fully functional on your local machine — explore, extend, and build agentic intelligence on your own data!

---

## 🧪 How to Use

Once both servers are running:

1. Open [http://localhost:3000](http://localhost:3000)
2. Use the **Upload Panel** to add PDFs or `.txt` files.
3. Enter natural language queries:
   - 🧠 *“Summarize this document.”* → Routed to Summary Agent  
   - 💬 *“What is the main argument of section 2?”* → Routed to QA Agent  
4. Watch the backend logs to see:
   - Intent classification (QA / SUMMARY)
   - Node transitions in the LangGraph
   - Final structured JSON response

---

### 💡 Example Queries

| Type | Example | Agent Invoked |
|------|----------|----------------|
| Summary | "Give me a short overview of this file" | 📝 Summary Generator |
| Critique | "How can I improve this paragraph?" | 💡 QA Generator |
| Clarification | "Explain section 3 in simple terms" | 💡 QA Generator |

---

### 📊 Debug View

In the backend terminal, you’ll see live logs like:

[Router] Intent detected: SUMMARY  
[SummaryAgent] Fetching context from pgvector...  
[SummaryAgent] Generating overview response...  
[Graph] Returning final output to user.  

This shows **how the LangGraph state machine routes and executes agents dynamically**.

---

## 🤝 Contributing

We welcome all contributions! 🚀  
If you’d like to improve **WorkFlowGen**, follow these steps:

1. **Fork** the repository  
2. **Create a feature branch:**  
   `git checkout -b feature/your-feature`  
3. **Commit your changes:**  
   `git commit -m "Add your feature"`  
4. **Push to your branch:**  
   `git push origin feature/your-feature`  
5. **Open a Pull Request** 🎉  

---

### 🧭 Contribution Guidelines

- Write clear, concise commit messages.  
- Keep code modular and well-documented.  
- Use `.env.example` to guide environment setup.  
- Run both frontend and backend locally before submitting PRs.

---

## 📄 License

This project is licensed under the **MIT License**.  

You are free to use, modify, and distribute this software as long as you include proper attribution.  

> © 2025 WorkFlowGen — Developed with ❤️ by [Prachet Singh](https://github.com/Prachet-Dev-Singh)

---

