import axios from "axios";

// Use the Environment Variable if available, otherwise default to Localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// 1. Upload Document
export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 2. Get All Documents
export const getDocuments = async () => {
  const response = await axios.get(`${API_URL}/documents`);
  return response.data;
};

// 3. Ask the AGENT (New!)
// This calls the LangGraph workflow
export const askAgent = async (question: string) => {
  const response = await axios.post(`${API_URL}/agent`, { question });
  return response.data;
};

// 4. Summarize Specific Document (Direct)
export const summarizeDocument = async (id: number) => {
  const response = await axios.post(`${API_URL}/summarize`, { document_id: id });
  return response.data;
};