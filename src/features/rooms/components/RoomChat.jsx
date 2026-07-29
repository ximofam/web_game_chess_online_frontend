import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Send, Lock, Loader2, MessageSquare } from 'lucide-react';
import { useSocket } from '../../../shared/socket/useSocket';
import { useAuth } from '../../auth/context/AuthContext';
import { roomService } from '../services/roomService';
import { formatTime } from '../../../shared/utils/timeUtils';
import { useTranslation } from 'react-i18next';

export function RoomChat({ roomId, room }) {
  const { t } = useTranslation(['room']);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const { subscribe, unsubscribe, send, connectionStatus } = useSocket();
  const { currentUser, showToast } = useAuth();
  const chatLocked = room?.settings?.chatLocked;

  const { data: history, isLoading } = useQuery({
    queryKey: ['roomChat', roomId],
    queryFn: () => roomService.getRoomChat(roomId),
    enabled: Boolean(roomId),
    staleTime: 1000 * 60, // 1 minute
  });

  // Sync query data to local state for appending new messages
  useEffect(() => {
    if (history && Array.isArray(history)) {

      setMessages(history);
    }
  }, [history]);

  // Subscribe to new chat messages
  useEffect(() => {
    if (!roomId || connectionStatus !== 'CONNECTED') return;

    const topic = `/topic/room.${roomId}`;
    const subId = subscribe(topic, (messageFrame) => {
      try {
        const event = JSON.parse(messageFrame.body);
        if (event && event.type === 'CHAT_MESSAGE' && event.data) {
          setMessages((prev) => [...prev, event.data]);
        }
      } catch (err) {
        console.error('[RoomChat] Failed to parse message', err);
      }
    });

    return () => {
      if (subId) unsubscribe(subId);
    };
  }, [roomId, connectionStatus, subscribe, unsubscribe]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || chatLocked) return;

    try {
      send(`/app/room.${roomId}.chat`, { message: inputValue.trim() });
      setInputValue('');
    } catch (err) {
      console.error('Failed to send message', err);
      showToast(t('room:sendMessageError', 'Lỗi gửi tin nhắn'), 'error');
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[500px] bg-[#1a1d24] border border-[#2d323f] rounded-2xl shadow-lg overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b border-[#2d323f] bg-[#1a1d24]">
        <MessageSquare className="w-4 h-4 text-[#d4af37]" />
        <h3 className="text-xs font-bold text-[#f3f4f6] uppercase tracking-wider">{t('room:chat', 'Trò chuyện')}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pr-2 space-y-3 min-h-[300px] bg-[#0d0e12]/30 scrollbar-thin">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-[#d4af37]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-xs text-[#9ca3af] italic py-4">
            {t('room:noMessages', 'Chưa có tin nhắn nào.')}
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender?.id === currentUser?.id;

            return (
              <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-[#9ca3af] mb-1 px-1 flex items-center gap-1">
                  {msg.sender?.username || 'Unknown'}
                  {msg.sentAt && (
                    <>
                      <span>•</span>
                      <span>{formatTime(msg.sentAt)}</span>
                    </>
                  )}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${isMe
                    ? 'bg-[#d4af37] text-[#0d0e12] rounded-br-none'
                    : 'bg-[#2d323f] text-[#f3f4f6] rounded-bl-none'
                    }`}
                  style={{ wordBreak: 'break-word' }}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-[#1a1d24] border-t border-[#2d323f]">
        {chatLocked ? (
          <div className="flex items-center justify-center gap-2 text-xs text-[#ef4444] py-2 bg-[#ef4444]/10 rounded-xl">
            <Lock className="w-3.5 h-3.5" />
            <span>{t('room:chatLocked', 'Chat trong phòng đã bị khóa')}</span>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('room:enterMessage', 'Nhập tin nhắn...')}
              className="flex-1 bg-[#0d0e12] border border-[#2d323f] rounded-xl px-3 py-2 text-sm text-[#f3f4f6] placeholder-[#6b7280] focus:outline-none focus:border-[#d4af37] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-[#d4af37] hover:bg-[#b59226] text-[#0d0e12] p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
