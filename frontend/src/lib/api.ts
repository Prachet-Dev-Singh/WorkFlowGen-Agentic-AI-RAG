import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getDocuments = async () => {
  const response = await axios.get(`${API_URL}/documents`);
  return response.data;
};

export const askQuestion = async (question: string) => {
  const response = await axios.post(`${API_URL}/qa`, { question });
  return response.data;
};

// Add this at the bottom
export const summarizeDocument = async (id: number) => {
  const response = await axios.post(`${API_URL}/summarize`, { document_id: id });
  return response.data;
};