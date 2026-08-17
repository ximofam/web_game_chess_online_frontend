import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useChatbot } from '../context/ChatbotContext';

const ChatbotWidget = () => {
  const { t } = useTranslation(['chatbot']);
  const { isOpen, toggleChat } = useChatbot();

  return (
    <button
      onClick={toggleChat}
      className={`relative p-2 rounded-full transition-all duration-200 flex items-center justify-center
        ${isOpen ? 'bg-chess-surface text-chess-gold' : 'text-chess-muted hover:text-chess-text hover:bg-chess-surface'}
        focus:outline-none focus:ring-2 focus:ring-chess-gold`}
      aria-label={t('chatbot:ask_ai')}
      title={t('chatbot:ask_ai')}
      aria-expanded={isOpen}
    >
      <Sparkles className="w-5 h-5" />
      {/* Subtle AI indicator/glow (optional) */}
      {!isOpen && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-chess-gold rounded-full opacity-80 animate-pulse"></span>
      )}
    </button>
  );
};

export default ChatbotWidget;
