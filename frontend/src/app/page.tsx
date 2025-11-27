"use client";

import { useState, useEffect } from "react";
import { uploadDocument, getDocuments, askQuestion, summarizeDocument } from "@/lib/api";
import { Send, Upload, FileText, Bot, Loader2 } from "lucide-react";

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load documents on start
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error("Failed to load docs", err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadDocument(file);
      await loadDocuments(); // Refresh list
      setFile(null);
      alert("Uploaded successfully!");
    } catch (error) {
      alert("Upload failed");
    }
    setUploading(false);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userQ = question;
    setChatHistory((prev) => [...prev, { role: "user", content: userQ }]);
    setQuestion("");
    setLoading(true);

    try {
      const data = await askQuestion(userQ);
      setChatHistory((prev) => [...prev, { role: "ai", content: data.answer }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: "ai", content: "Error connecting to AI." }]);
    }
    setLoading(false);
  };

  const handleSummarize = async (docId: number, docTitle: string) => {
    setChatHistory((prev) => [...prev, { role: "user", content: `Summarize ${docTitle}` }]);
    setLoading(true);
    try {
      const data = await summarizeDocument(docId);
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", content: `📝 **Summary of ${docTitle}:**\n\n${data.summary}` },
      ]);
    } catch (e) {
      setChatHistory((prev) => [...prev, { role: "ai", content: "Failed to summarize." }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bot className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">WorkFlowGen</h1>
        </div>
        <div className="text-sm text-gray-500">AI Agentic Copilot</div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
        {/* LEFT PANEL: Documents */}
        <div className="col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-[85vh]">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" /> Documents
          </h2>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                {file ? file.name : "Click to Upload PDF/TXT"}
              </span>
            </label>
            {file && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 bg-blue-600 text-white text-sm px-4 py-2 rounded-md w-full hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Start Processing"}
              </button>
            )}
          </div>

          {/* Document List */}
          <div className="mt-6 flex-1 overflow-y-auto">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Knowledge Base
            </h3>
            <div className="space-y-2">
              {documents.map((doc: any) => (
                <div
                  key={doc.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <FileText className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-sm font-medium truncate">{doc.title}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Summarize Button */}
                  <button
                    onClick={() => handleSummarize(doc.id, doc.title)}
                    className="text-xs bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 py-1 px-2 rounded self-end w-full transition-colors"
                  >
                    Summarize
                  </button>
                </div>
              ))}
              {documents.length === 0 && (
                <p className="text-sm text-gray-400 text-center mt-10">
                  No documents uploaded yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Chat */}
        <div className="col-span-8 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[85vh]">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
            <h2 className="text-lg font-semibold text-gray-800">Agent Workflow</h2>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                <Bot className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-600">How can I help you today?</p>
                <p className="text-sm text-gray-400">
                  Ask about your documents or request a summary.
                </p>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-500">Agent is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Ask a question about your documents..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}