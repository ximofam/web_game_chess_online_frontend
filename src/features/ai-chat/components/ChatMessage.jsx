import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ChatMessage = ({ role, content }) => {
  const isAI = role === 'ai';
  const { t } = useTranslation(['chatbot']);

  return (
    <div className={`flex w-full ${isAI ? 'justify-start' : 'justify-end'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-[85%] ${isAI ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
        
        {/* Avatar */}
        {isAI && (
          <div className="w-8 h-8 rounded bg-chess-surface border border-chess-border flex items-center justify-center text-chess-gold shrink-0 mb-1" aria-hidden="true">
            <Sparkles className="w-4 h-4" />
          </div>
        )}

        {/* Message Bubble */}
        <div 
          className={`flex flex-col px-4 py-2.5 
          ${isAI 
            ? 'bg-transparent text-chess-text' 
            : 'bg-chess-surface text-chess-text rounded-2xl rounded-br-sm border border-chess-border'
          }`}
        >
          {isAI && (
            <span className="text-xs font-semibold text-chess-muted mb-1">{t('chatbot:ai_name')}</span>
          )}
          
          <div className="whitespace-pre-wrap text-[15px] leading-relaxed break-words">
            {/* Simple parsing for markdown-like bold and lists can go here if needed later, 
                for now standard rendering is requested, or robust markdown rendering via marked/react-markdown */}
            {content}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatMessage;
