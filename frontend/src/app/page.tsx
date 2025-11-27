"use client";

import { useState, useEffect } from "react";
import { uploadDocument, getDocuments, askAgent, summarizeDocument } from "@/lib/api";
import { Send, Upload, FileText, Bot, Loader2, BrainCircuit } from "lucide-react";

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
    // 1. Show User Question
    setChatHistory((prev) => [...prev, { role: "user", content: userQ }]);
    setQuestion("");
    setLoading(true);

    try {
      // 2. Call the Agent
      const data = await askAgent(userQ);
      
      // 3. Show Agent Response
      setChatHistory((prev) => [...prev, { role: "ai", content: data.answer }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: "ai", content: "Error: Could not connect to the Agent." }]);
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
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">WorkFlowGen</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Agent Active
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
        {/* LEFT PANEL: Documents */}
        <div className="col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-[85vh]">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Knowledge Base
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
                className="mt-4 bg-indigo-600 text-white text-sm px-4 py-2 rounded-md w-full hover:bg-indigo-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Start Processing"}
              </button>
            )}
          </div>

          {/* Document List */}
          <div className="mt-6 flex-1 overflow-y-auto">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Uploaded Files
            </h3>
            <div className="space-y-2">
              {documents.map((doc: any) => (
                <div
                  key={doc.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex flex-col gap-2 group hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded border border-gray-200 text-indigo-500">
                      <FileText className="w-4 h-4" />
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
                    className="text-xs bg-white border border-gray-200 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 py-1.5 px-2 rounded self-end w-full transition-colors flex items-center justify-center gap-1"
                  >
                    <BrainCircuit className="w-3 h-3" /> Summarize
                  </button>
                </div>
              ))}
              {documents.length === 0 && (
                <p className="text-sm text-gray-400 text-center mt-10">
                  No documents yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Chat */}
        <div className="col-span-8 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[85vh]">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-600" /> Agent Workflow
            </h2>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Gemini 2.0 Flash</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                <BrainCircuit className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-600">I am your Agentic Copilot.</p>
                <p className="text-sm text-gray-400 max-w-sm mt-2">
                  I can route your request to a QA expert or a Summarization expert automatically.
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
                    className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {msg.content}
                    </p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white border border-indigo-100 rounded-2xl rounded-bl-none p-4 flex items-center gap-3 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Agent is thinking...</span>
                    <span className="text-xs text-gray-400">Routing request & Retrieving context</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Ask me anything..."
                className="flex-1 border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
              />
              <button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg active:scale-95"
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