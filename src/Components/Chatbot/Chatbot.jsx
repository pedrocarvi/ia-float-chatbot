import React, { useState } from "react";
import './Chatbot.css';
import { motion } from "framer-motion";
import { X, MessageCircle, Send } from "lucide-react";
import axios from "axios";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    nroAsociado: "",
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Manejo de cambio de inputs en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejo del envío del formulario
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validación simple: asegurarse que nombre y email no estén vacíos.
    if (!formData.nombre || !formData.email) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }

    console.log("Acá podriamos hacer la llamada a la API de Leads si el usuario no ingresa nro. asociado")
    console.log("Datos del formulario:", formData);
    setFormSubmitted(true);
  };

  // Handle user input submission (chat)
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5002/chatbot-web", {
        question: input,
        asociadoNumber: formData.nroAsociado
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
    <div>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="chatbot-container"
        >
          {/* Cabecera del chatbot */}
          <div className="chatbot-header">
            <h2>Ava - Asistente Virtual</h2>
            <button onClick={toggleChatbot}>
              <X size={20} color="white" />
            </button>
          </div>

          {/* Si el formulario no fue enviado, se muestra el formulario */}
          {!formSubmitted ? (
            <div className="chatbot-form-container">
              <form onSubmit={handleFormSubmit}>
                <div className="chatbot-form-input-ctn">
                  <label className="chatbot-form-label">
                    Nombre:
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ingrese su nombre"
                      required
                    />
                  </label>
                </div>
                <div className="chatbot-form-input-ctn">
                  <label className="chatbot-form-label">
                    Email:
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ingrese su email"
                      required
                    />
                  </label>
                </div>
                <div className="chatbot-form-input-ctn">
                  <label className="chatbot-form-label">
                    Nº de Asociado (opcional):
                    <input
                      type="text"
                      name="nroAsociado"
                      value={formData.nroAsociado}
                      onChange={handleInputChange}
                      placeholder="Ingrese su nro. de asociado"
                    />
                  </label>
                </div>
                <button type="submit" className="chatbot-form-btn">Iniciar Chat</button>
              </form>
            </div>
          ) : (
            // Si el formulario fue enviado, se muestra la interfaz del chat.
            <>
              {/* Mensajes del chat */}
              <div className="chatbot-messages">
                {messages.map((message, index) => (
                  <div key={index}>
                    <p
                      className={`chatbot-message ${message.role === "user" ? "chatbot-message-user" : "chatbot-message-bot"}`}
                    >
                      {message.content}
                    </p>
                  </div>
                ))}
                {loading && <p className="writing-text">Escribiendo...</p>}
              </div>

              {/* Input para enviar mensajes */}
              <div className="chatbot-msg-send-container">
                <div className="chatbot-msg-send">
                  <input
                    type="text"
                    placeholder="Haz una pregunta..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="chatbot-input"
                  />
                  <button onClick={handleSend} className="chatbot-send-btn">
                    <Send width={20} color="white" />
                  </button>
                </div>

                {/* Boton Contacto por WhatsApp */}
                <a href="https://api.whatsapp.com/send?phone=541126320419&&text=Hola!%20buen%20d%C3%ADa" target="_blank" className="asesor-whatsapp-btn">
                  Contactar asesor vía WhatsApp
                </a>
              </div>
            </>
          )}
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