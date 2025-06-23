import React, { useState, useRef, useEffect } from 'react';
import './ChatBotPage.css';
import { FiSend, FiPaperclip, FiMic, FiImage, FiCheckCircle } from 'react-icons/fi';
import { BsPerson, BsLock, BsClock } from 'react-icons/bs';

const BOT_AVATAR = '/images/puppy.png';
const SYSTEM_PROMPT = "You are a helpful AI assistant. I'm here to help answer your questions, provide information, and assist with various tasks. How can I help you today?";

// These messages are for UI display only.
// The initial bot greeting is NOT included in the API payload.
const initialMessages = [
  {
    type: 'system',
    content: (
      <>
        <div className="chatbot-welcome-icon"><BsLock size={32} /></div>
        <div className="chatbot-welcome-header">Welcome to AI Assistant</div>
        <div className="chatbot-welcome-desc">
          I'm here to help answer your questions, provide information, and assist with various tasks. How can I help you today?
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#777' }}>
          ⚠️ This chat does not currently save your conversation history. Reloading the page will clear all messages.
        </div>
      </>
    ),
  },
  {
    type: 'bot',
    content: "Woof! I’m Trackie, your helpful little pup 🐶. I can fetch answers, help you out, or just keep you company. What would you like to talk about today?",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
];

export default function ChatBotPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  const chatEndRef = useRef(null);

  // File & Image input refs
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // MediaRecorder refs for voice (NOT USED in placeholder mode)
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Only include real conversation turns for the API: system + user/assistant alternation.
  // The initial bot greeting is for UI only and must NOT be sent to the API.
  const buildTogetherMessages = (allMessages) => {
    const togetherMsgs = [
      { role: "system", content: SYSTEM_PROMPT }
    ];
    // Only add user/assistant turns AFTER the first user message.
    // Find the first user message index
    const firstUserIdx = allMessages.findIndex(m => m.type === 'user' && typeof m.content === 'string');
    if (firstUserIdx === -1) return togetherMsgs; // no user yet

    // Start with the first user and include all subsequent user/bot turns
    for (let i = firstUserIdx; i < allMessages.length; i++) {
      const m = allMessages[i];
      if (m.type === 'user' && typeof m.content === 'string') {
        togetherMsgs.push({ role: 'user', content: m.content });
      } else if (m.type === 'bot' && typeof m.content === 'string') {
        togetherMsgs.push({ role: 'assistant', content: m.content });
      }
    }
    return togetherMsgs;
  };

  // Helper: Add a user message and send it to Together AI
  const handleSendTextAsUserMessage = async (text) => {
    const userMessage = {
      type: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setLoading(true);
    try {
      const apiMessages = buildTogetherMessages(nextMessages).slice(-12);
      const res = await fetch('https://trackie.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          content: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          content: "Sorry, something went wrong. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
    setLoading(false);
  };

  // Send message to backend (standard text chat)
  const handleSend = async () => {
    if (input.trim() === '' || loading) return;
    await handleSendTextAsUserMessage(input.trim());
    setInput('');
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- Voice Recording functionality (PLACEHOLDER) ---
  const handleMicClick = async () => {
    
    setMessages(msgs => [
      ...msgs,
      {
        type: 'bot',
        content: 'tsega is working on it, will be functional coming soon',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    // Do NOT start recording
    // setRecording(true); // <-- NOT USED IN PLACEHOLDER
  };

  // --- Image Upload functionality (WORKING) ---
  const handleImageUpload = () => imageInputRef.current.click();
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setMessages(msgs => [...msgs, { type: 'user', content: '[Image uploaded]', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setLoading(true);
    try {
      const res = await fetch('https://trackie.onrender.com/api/image', { method: 'POST', body: formData });
      const data = await res.json();
      await handleSendTextAsUserMessage(data.caption || '[Image could not be described]');
    } catch {
      setMessages(msgs => [...msgs, { type: 'bot', content: "Image description failed.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
    setLoading(false);
    e.target.value = ''; // Reset input
  };

  // --- File Upload functionality (PLACEHOLDER) ---
  const handleFileUpload = () => fileInputRef.current.click();
  const handleFileChange = async (e) => {
    
    setMessages(msgs => [
      ...msgs,
      {
        type: 'bot',
        content: 'tsega is working on it, will be functional coming soon',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    // Do NOT send to backend
    e.target.value = ''; // Reset input
  };

  return (
    <div className="chatbot-root-container">
      <div className="chatbot-main-area">
        <div className="chatbot-header">
          <span className="chatbot-title">
            <img src={BOT_AVATAR} alt="AI Assistant" className="chatbot-title-avatar" />
            AI Assistant <span className="chatbot-online"><FiCheckCircle /> Online</span>
          </span>
        </div>

        <div className="chatbot-messages-area">
          {messages.map((msg, idx) => {
            if (msg.type === 'system') {
              return (
                <div key={idx} className="chatbot-system-message">
                  {msg.content}
                </div>
              );
            }
            return (
              <div
                key={idx}
                className={
                  msg.type === 'user'
                    ? 'chatbot-message chatbot-message-user'
                    : 'chatbot-message chatbot-message-bot'
                }
              >
                <div className="chatbot-message-bubble">
                  <span className="chatbot-message-icon">
                    {msg.type === 'user' ? (
                      <BsPerson />
                    ) : (
                      <img src={BOT_AVATAR} alt="AI" className="chatbot-bot-avatar" />
                    )}
                  </span>
                  <span className="chatbot-message-content">{msg.content}</span>
                </div>
                <div className="chatbot-message-time">
                  <BsClock size={12} />
                  <span>{msg.time}</span>
                </div>
              </div>
            );
          })}
          {loading && (
  <div className="chatbot-message chatbot-message-bot">
    <div className="chatbot-message-bubble">
      <span className="chatbot-message-icon">
        <img src={BOT_AVATAR} alt="AI" className="chatbot-bot-avatar" />
      </span>
      <span className="chatbot-message-content">
        <span className="typing-dots">
          <span>.</span><span>.</span><span>.</span>
        </span>
      </span>
    </div>
  </div>
)}

          <div ref={chatEndRef} />
        </div>

        <div className="chatbot-input-area">
          <div className="chatbot-input-attachments">
            <button type="button" className="chatbot-attach-btn" title="Attach file" onClick={handleFileUpload} disabled={loading}>
              <FiPaperclip />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button type="button" className="chatbot-action-btn" title="Image" onClick={handleImageUpload} disabled={loading}>
              <FiImage />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          <textarea
            className="chatbot-input"
            rows={1}
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={loading}
          />
          <div className="chatbot-input-actions">
            <button
              className="chatbot-action-btn"
              title="Voice"
              onClick={handleMicClick}
              disabled={loading}
              style={recording ? { color: 'red' } : {}}
            >
              <FiMic />
            </button>
            <button
              className="chatbot-send-btn"
              title="Send"
              onClick={handleSend}
              disabled={input.trim() === '' || loading}
            >
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}