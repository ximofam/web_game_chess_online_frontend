import { useState, useRef, useEffect, useMemo } from 'react';
import { X, SquarePen, Menu, Sparkles, RefreshCw, ArrowLeft, Minus, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useChatbot } from '../context/ChatbotContext';
import { groupItemsByDate } from '../../../shared/utils/dateUtils';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

const MOCK_SUGGESTIONS = [
  'suggestion_1',
  'suggestion_2',
  'suggestion_3',
  'suggestion_4',
];

const ChatbotPanel = () => {
  const { t } = useTranslation(['chatbot']);
  const { 
    isOpen, 
    isMinimized, 
    minimizeChat, 
    restoreChat, 
    closeChat, 
    messages, 
    messagesLoading,
    messagesError,
    isGenerating, 
    error, 
    handleSend, 
    handleNewChat,
    sessions,
    sessionsLoading,
    sessionsError,
    activeSessionId,
    selectSession
  } = useChatbot();
  
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating, messagesLoading]);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleSelectSession = (sessionId) => {
    selectSession(sessionId);
    setShowHistory(false);
  };

  const groupedSessions = useMemo(() => {
    return groupItemsByDate(sessions, 'created_at');
  }, [sessions]);

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed right-5 bottom-5 z-[60] animate-in slide-in-from-bottom-2 duration-200">
        <button
          onClick={restoreChat}
          className="flex items-center gap-2 px-4 py-3 bg-chess-surface border border-chess-border shadow-2xl rounded-t-lg rounded-b-lg hover:border-chess-gold transition-colors focus:outline-none focus:ring-2 focus:ring-chess-gold group"
          aria-label={t('chatbot:open')}
        >
          <Sparkles className="w-5 h-5 text-chess-gold group-hover:animate-pulse" />
          <span className="font-semibold text-sm text-chess-text">{t('chatbot:ai_name')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col fixed inset-0 md:inset-auto md:right-5 md:bottom-5 md:w-[400px] md:h-[650px] md:max-h-[calc(100vh-100px)] z-[60] bg-chess-dark md:border md:border-chess-border md:rounded-xl shadow-2xl animate-in slide-in-from-right-8 md:slide-in-from-bottom-4 duration-300 ease-out overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-chess-border bg-chess-surface shrink-0 h-14">
        <div className="flex items-center gap-3">
          {/* Mobile close button */}
          <button
            onClick={closeChat}
            className="md:hidden p-1.5 -ml-2 rounded hover:bg-chess-dark hover:text-chess-text transition-colors text-chess-muted"
            aria-label={t('chatbot:close')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-chess-gold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-chess-text flex items-center gap-2 leading-tight">
              {t('chatbot:ai_name')}
            </h3>
            <span className="text-[11px] text-chess-muted leading-tight">
              {t('chatbot:ai_description')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-chess-muted">
          <button
            onClick={handleNewChat}
            className="p-1.5 rounded hover:bg-chess-dark hover:text-chess-text transition-colors"
            aria-label={t('chatbot:new_chat')}
            title={t('chatbot:new_chat')}
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={toggleHistory}
            className={`p-1.5 rounded transition-colors ${showHistory ? 'bg-chess-dark text-chess-text' : 'hover:bg-chess-dark hover:text-chess-text'}`}
            aria-label={t('chatbot:chat_history')}
            title={t('chatbot:chat_history')}
          >
            <Menu className="w-4 h-4" />
          </button>
          {/* Desktop Minimize button */}
          <button
            onClick={minimizeChat}
            className="hidden md:flex p-1.5 rounded hover:bg-chess-dark hover:text-chess-text transition-colors"
            aria-label={t('chatbot:minimize')}
            title={t('chatbot:minimize')}
          >
            <Minus className="w-5 h-5" />
          </button>
          {/* Close button */}
          <button
            onClick={closeChat}
            className="hidden md:flex p-1.5 rounded hover:bg-chess-dark hover:text-chess-text transition-colors"
            aria-label={t('chatbot:close')}
            title={t('chatbot:close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 overflow-hidden flex flex-col bg-chess-dark">
        {/* History Drawer */}
        {showHistory && (
          <div className="absolute inset-0 z-10 bg-chess-surface border-r border-chess-border animate-in slide-in-from-right-4 duration-200">
            <div className="p-4 border-b border-chess-border flex justify-between items-center h-14 shrink-0">
              <div className="flex items-center gap-2 text-chess-text font-semibold">
                <ArrowLeft className="w-4 h-4 cursor-pointer text-chess-muted hover:text-chess-text transition-colors" onClick={() => setShowHistory(false)} />
                <span className="text-sm">{t('chatbot:chat_history')}</span>
              </div>
            </div>
            <div className="p-2 space-y-1 overflow-y-auto h-[calc(100%-3.5rem)]">
              {sessionsLoading && sessions.length === 0 ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-chess-gold" />
                </div>
              ) : sessionsError ? (
                <div className="p-4 text-center text-sm text-red-400">
                  {sessionsError}
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-4 text-center text-sm text-chess-muted">
                  {t('chatbot:empty_history')}
                </div>
              ) : (
                <>
                  {groupedSessions.today.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-chess-muted uppercase tracking-wider mt-2">
                        {t('chatbot:today')}
                      </div>
                      {groupedSessions.today.map((session) => (
                        <button
                          key={session.id}
                          onClick={() => handleSelectSession(session.id)}
                          className={`w-full text-left px-3 py-2 rounded text-sm truncate transition-colors ${activeSessionId === session.id ? 'bg-chess-dark text-chess-gold' : 'text-chess-text hover:bg-chess-dark'}`}
                          title={session.title}
                        >
                          {session.title || t('chatbot:generating_title')}
                        </button>
                      ))}
                    </>
                  )}
                  {groupedSessions.yesterday.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-chess-muted uppercase tracking-wider mt-4">
                        {t('chatbot:yesterday')}
                      </div>
                      {groupedSessions.yesterday.map((session) => (
                        <button
                          key={session.id}
                          onClick={() => handleSelectSession(session.id)}
                          className={`w-full text-left px-3 py-2 rounded text-sm truncate transition-colors ${activeSessionId === session.id ? 'bg-chess-dark text-chess-gold' : 'text-chess-text hover:bg-chess-dark'}`}
                          title={session.title}
                        >
                          {session.title || t('chatbot:generating_title')}
                        </button>
                      ))}
                    </>
                  )}
                  {groupedSessions.older.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-chess-muted uppercase tracking-wider mt-4">
                        {t('chatbot:older')}
                      </div>
                      {groupedSessions.older.map((session) => (
                        <button
                          key={session.id}
                          onClick={() => handleSelectSession(session.id)}
                          className={`w-full text-left px-3 py-2 rounded text-sm truncate transition-colors ${activeSessionId === session.id ? 'bg-chess-dark text-chess-gold' : 'text-chess-text hover:bg-chess-dark'}`}
                          title={session.title}
                        >
                          {session.title || t('chatbot:generating_title')}
                        </button>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messagesLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-chess-gold" />
            </div>
          ) : messagesError ? (
            <div className="h-full flex items-center justify-center text-sm text-red-400">
              {messagesError}
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-[280px] mx-auto space-y-5">
              <div className="w-12 h-12 rounded-full bg-chess-surface border border-chess-border flex items-center justify-center text-chess-gold mb-1">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-chess-text mb-1">{t('chatbot:ai_name')}</h2>
                <p className="text-xs text-chess-muted">{t('chatbot:ai_description')}</p>
              </div>
              
              <div className="w-full grid grid-cols-1 gap-2 mt-4">
                {MOCK_SUGGESTIONS.map((sKey) => (
                  <button
                    key={sKey}
                    onClick={() => handleSend(t(`chatbot:${sKey}`))}
                    className="text-left px-4 py-2.5 rounded-lg border border-chess-border bg-chess-surface hover:border-chess-gold hover:bg-chess-dark transition-colors text-xs text-chess-text group"
                  >
                    {t(`chatbot:${sKey}`)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <ChatMessage key={msg.id || idx} role={msg.role} content={msg.content} />
              ))}
              {isGenerating && (
                <div className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 rounded bg-chess-surface border border-chess-border flex items-center justify-center text-chess-gold shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-chess-muted text-sm font-mono">
                    <span className="w-1.5 h-1.5 bg-chess-muted rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-chess-muted rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-chess-muted rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              {error && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 flex flex-col gap-2 my-2">
                  <p className="text-sm text-red-200">{t('chatbot:error_message')}</p>
                  <button 
                    className="text-xs text-chess-gold hover:underline self-start flex items-center gap-1"
                    onClick={() => handleSend(messages[messages.length-1]?.content || '')}
                  >
                    <RefreshCw className="w-3 h-3" />
                    {t('chatbot:retry')}
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-chess-dark shrink-0 border-t border-chess-border/50">
        <ChatInput onSend={handleSend} disabled={isGenerating || messagesLoading} />
      </div>
    </div>
  );
};

export default ChatbotPanel;
