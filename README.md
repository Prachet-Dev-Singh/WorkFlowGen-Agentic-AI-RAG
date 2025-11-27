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
