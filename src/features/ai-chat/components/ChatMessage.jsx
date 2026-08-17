import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatMessage = ({ role, content }) => {
  const isAI = role === 'ai' || role === 'assistant';
  const { t } = useTranslation(['chatbot']);

  return (
    <div className={`flex w-full ${isAI ? 'justify-start' : 'justify-end'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {isAI ? (
        // AI Message Design (Modern Assistant style: avatar on left, text flowing normally)
        <div className="flex w-full max-w-[95%] gap-3 items-start">
          <div className="w-8 h-8 rounded-lg bg-chess-dark border border-chess-border flex items-center justify-center text-chess-gold shrink-0 mt-1 shadow-sm" aria-hidden="true">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs font-semibold text-chess-muted mb-1 ml-1">{t('chatbot:ai_name')}</span>
            <div className="prose prose-invert prose-sm max-w-none text-chess-text prose-p:leading-relaxed prose-pre:bg-chess-dark prose-pre:border prose-pre:border-chess-border prose-a:text-chess-gold prose-strong:text-chess-text break-words">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ) : (
        // User Message Design (Bubble style)
        <div className="flex max-w-[85%] flex-row-reverse items-end gap-2">
          {/* Optional small avatar for user if we want it, but usually omitted in iMessage style. We can leave it out for a cleaner look, or use a tiny avatar */}
          <div 
            className="flex flex-col px-4 py-2.5 bg-chess-surface text-chess-text rounded-2xl rounded-tr-sm border border-chess-border shadow-sm"
          >
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed break-words">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
