import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ChatInput = ({ onSend, disabled }) => {
  const { t } = useTranslation(['chatbot']);
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  // Focus input on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim() && !disabled) {
        onSend(text);
        setText('');
      }
    }
  };

  const handleSendClick = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
      textareaRef.current?.focus();
    }
  };

  return (
    <div className="relative bg-chess-dark border border-chess-border rounded-xl shadow-sm focus-within:ring-1 focus-within:ring-chess-gold focus-within:border-chess-gold transition-all duration-200">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('chatbot:placeholder')}
        disabled={disabled}
        rows={1}
        className="w-full bg-transparent text-chess-text placeholder:text-chess-muted px-4 py-3 pr-12 rounded-xl resize-none focus:outline-none scrollbar-thin scrollbar-thumb-chess-border scrollbar-track-transparent disabled:opacity-50 min-h-[44px]"
        aria-label={t('chatbot:placeholder')}
      />
      <button
        onClick={handleSendClick}
        disabled={!text.trim() || disabled}
        className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-chess-gold text-chess-dark disabled:bg-chess-surface disabled:text-chess-muted hover:bg-chess-gold-hover transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-chess-gold focus:ring-offset-1 focus:ring-offset-chess-dark"
        aria-label="Send message"
      >
        <Send className="w-4 h-4 ml-0.5" />
      </button>
    </div>
  );
};

export default ChatInput;
