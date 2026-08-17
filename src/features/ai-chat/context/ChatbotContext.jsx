import { createContext, useContext, useState, useCallback } from 'react';
/* eslint-disable react-refresh/only-export-components */

const ChatbotContext = createContext(null);

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    setIsMinimized(false);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const minimizeChat = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const restoreChat = useCallback(() => {
    setIsMinimized(false);
  }, []);

  const handleSend = useCallback((text) => {
    if (!text.trim()) return;
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsGenerating(true);

    // Mock API call
    setTimeout(() => {
      setIsGenerating(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: "Here is a simulated response about chess. En passant is a special pawn capture that can occur when a pawn moves two squares from its starting position.",
        },
      ]);
    }, 1500);
  }, []);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const value = {
    isOpen,
    isMinimized,
    toggleChat,
    closeChat,
    openChat,
    minimizeChat,
    restoreChat,
    messages,
    isGenerating,
    error,
    handleSend,
    handleNewChat,
    setError
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};
