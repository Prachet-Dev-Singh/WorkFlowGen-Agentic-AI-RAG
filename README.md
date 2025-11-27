# 🤖 WorkFlowGen: Agentic AI Analyst

**WorkFlowGen** is a full-stack **Agentic RAG (Retrieval Augmented Generation)** platform designed to intelligently analyze, summarize, and extract insights from documents. 

Unlike traditional chatbots, WorkFlowGen uses a **Semantic Router** powered by **Google Gemini 2.0 Flash** to understand user intent (QA vs. Summarization) and routes requests to specialized agents using **LangGraph**.

![Project Status](https://img.shields.io/badge/Status-MVP_Complete-success)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_16_%7C_FastAPI_%7C_LangGraph-blueviolet)
![AI](https://img.shields.io/badge/AI-Gemini_2.0_Flash-orange)

## 🚀 Key Features

* **🧠 Agentic Workflow:** Replaces linear logic with a **LangGraph State Machine**.
    * **Router Agent:** Uses structured output (JSON) to semantically classify user intent.
    * **Retriever Node:** Fetches relevant context using **pgvector** similarity search.
    * **Specialized Workers:** Separate agents for detailed QA and professional summarization.
* **🎯 Semantic Routing:** Intelligently distinguishes between "asking for help/critique" and "asking for a summary" without relying on brittle keywords.
* **⚡ structured Output:** Enforces strict JSON schemas on the LLM to prevent routing errors and hallucinations.
* **📄 Document Ingestion:** Asynchronous pipeline for parsing and vectorizing text/PDF files.
* **📊 Modern Dashboard:** Real-time UI built with **Next.js 16**, **Tailwind CSS**, and **Lucide React**.

## 🏗️ Architecture (Agentic Flow)

The system follows a cyclic graph architecture rather than a linear chain:

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
