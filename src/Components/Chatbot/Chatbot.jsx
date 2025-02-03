import React, { useState } from "react";
import './Chatbot.css';
import { motion } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import axios from "axios";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Handle user input submission
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5002/chatbot-web", {
        question: input,
      });

      const botResponse = {
        role: "assistant",
        content: response.data.response || "No recibí una respuesta, intenta nuevamente.",
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error al obtener respuesta. Intenta más tarde." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-[450px]">
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="w-full h-96 bg-white rounded-lg shadow-xl border p-4 flex flex-col justify-between chatbot-container"
        >
          {/* Chat header */}
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-semibold">Asistente Virtual</h2>
            <button onClick={toggleChatbot} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto mt-2 mb-4 chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
                <p
                  className={`inline-block px-3 py-2 rounded-xl shadow-md ${
                    message.role === "user"
                      ? "bg-blue-600 text-white self-end"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
            {loading && <p className="text-gray-500">Escribiendo...</p>}
          </div>

          {/* Chat input */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Haz una pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none chatbot-input"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 chatbot-send-btn"
            >
              Enviar
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="btn-not-opened bg-blue-500 p-3 rounded-full shadow-lg hover:bg-blue-600"
          onClick={toggleChatbot}
        >
          <MessageCircle color="white" size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default Chatbot;