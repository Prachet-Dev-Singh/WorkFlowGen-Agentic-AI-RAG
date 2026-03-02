# 🤖 WorkFlowGen — Generative AI Document Intelligence Platform

<div align="center">

![Generative AI](https://img.shields.io/badge/Generative%20AI-LLM%20Powered-green)
![RAG](https://img.shields.io/badge/RAG-Agentic-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-black)

### An End-to-End Agentic RAG System for Intelligent Document Processing and Analysis

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
    A[User Input] --> B[FastAPI Endpoint]
    B --> C{LangGraph Workflow}

    subgraph Agent_Brain [Agent Brain]
        C --> D[Retriever Node]
        D --> E[Semantic Router]

        E -->|Intent: QA| F[QA Generator]
        E -->|Intent: SUMMARY| G[Summary Generator]
    end

    F --> H[Final Response]
    G --> H
```

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

```bash
git clone https://github.com/Prachet-Dev-Singh/WorkFlowGen.git
cd WorkFlowGen
```

---

### 🗃️ 3. Database Setup (PostgreSQL + pgvector via Docker)

Spin up the database container:

```bash
docker compose -f infra/docker-compose.yml up -d
```

✅ Verify that your database is running:

```bash
docker ps
```

This launches a PostgreSQL instance with **pgvector** extension pre-installed for efficient semantic search.

---

### ⚙️ 4. Backend Setup (FastAPI + LangGraph)

Navigate to the backend directory and create a virtual environment:

```bash
cd backend
python -m venv venv
```

Activate the environment:

```bash
# Windows (Git Bash)
source venv/Scripts/activate

# Mac/Linux
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

#### 🔑 Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```bash
touch .env
```

Paste the following and replace `YOUR_GEMINI_API_KEY_HERE`:

```env
# Local Docker Database
DATABASE_URL=postgresql+asyncpg://admin:password123@localhost:5432/workflowgen_db

# Google Gemini API Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

#### 🗄️ Initialize the Database Schema

```bash
python init_db.py
# ✅ Tables created successfully!
```

#### 🚀 Start the Backend Server

```bash
uvicorn app.main:app --reload
```

Backend runs on → **http://localhost:8000**

---

### 🎨 5. Frontend Setup (Next.js + Tailwind CSS)

Open a **new terminal** and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

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

```bash
docker compose -f infra/docker-compose.yml down
```

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

```text
[Router] Intent detected: SUMMARY
[SummaryAgent] Fetching context from pgvector...
[SummaryAgent] Generating overview response...
[Graph] Returning final output to user.
```

This shows **how the LangGraph state machine routes and executes agents dynamically**.

---


## 📄 License

This project is licensed under the **MIT License**.  

---
