# 🤖 WorkFlowGen: Agentic AI Analyst

**WorkFlowGen** is a full-stack RAG (Retrieval Augmented Generation) platform designed to analyze, summarize, and extract insights from complex documents. It leverages **Google's Gemini 2.0 Flash** for high-speed inference and **PostgreSQL (pgvector)** for semantic search.

![Project Status](https://img.shields.io/badge/Status-MVP_Complete-success)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_16_%7C_FastAPI_%7C_PostgreSQL-blue)

## 🚀 Features

* **📄 Document Ingestion:** Supports uploading text and PDF files.
* **🧠 Semantic Search:** Uses **pgvector** to perform vector similarity search, retrieving the most relevant context for every query.
* **⚡ AI-Powered Q&A:** Integrated with **Gemini 2.0 Flash** to answer questions based strictly on document context (reducing hallucinations).
* **📝 Auto-Summarization:** Dedicated pipeline to generate professional summaries of long documents.
* **⚡ Real-time Dashboard:** Modern UI built with **Next.js 16** and **Tailwind CSS**.

## 🏗️ Architecture

The system follows a microservices-ready architecture:

```mermaid
flowchart TD
    A["Frontend (Next.js)"] -->|"HTTP/JSON"| B["Backend API (FastAPI)"]
    B -->|"SQL/Vectors"| C[("PostgreSQL + pgvector")]
    B -->|"Embeddings & Generation"| D["Google Gemini API"]
