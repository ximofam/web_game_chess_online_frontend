import { X, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ApprovalInfoModal({ isOpen, onClose, status, approvalInfo, title }) {
  const { t } = useTranslation(['forum']);
  if (!isOpen) return null;

  const getStatusDisplay = (st) => {
    switch (st) {
      case 'APPROVED':
        return {
          label: t('forum:approved'),
          badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        };
      case 'DENIED':
        return {
          label: t('forum:denied'),
          badgeClass: 'bg-red-500/10 text-red-500 border-red-500/20',
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        };
      case 'PENDING':
      default:
        return {
          label: t('forum:pending_ai'),
          badgeClass: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
          icon: <Clock className="w-5 h-5 text-yellow-500 animate-spin" />,
        };
    }
  };

  const statusInfo = getStatusDisplay(status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-md bg-chess-surface border border-chess-border rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-chess-border">
          <h3 className="font-playfair font-bold text-lg text-chess-text">{t('forum:approval_details')}</h3>
          <button
            onClick={onClose}
            className="p-1 text-chess-muted hover:text-chess-text rounded-md hover:bg-chess-dark transition-colors focus:outline-none focus:ring-2 focus:ring-chess-gold"
            aria-label={t('forum:close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <span className="font-inter text-xs font-semibold text-chess-muted uppercase tracking-widest">{t('forum:post')}</span>
            <p className="font-inter font-bold text-chess-text line-clamp-2 mt-1">{title}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-inter text-xs font-semibold text-chess-muted uppercase tracking-widest">{t('forum:status_label')}</span>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 font-inter text-xs font-bold uppercase tracking-widest rounded border ${statusInfo.badgeClass}`}>
              {statusInfo.icon}
              <span>{statusInfo.label}</span>
            </div>
          </div>

          {approvalInfo ? (
            <div className="p-4 bg-chess-dark border border-chess-border rounded-lg space-y-3">
              {approvalInfo.approvalNote && (
                <div>
                  <span className="font-inter text-xs font-semibold text-chess-muted">{t('forum:ai_note_label')}</span>
                  <p className="font-inter text-sm text-chess-text mt-1.5 whitespace-pre-line leading-relaxed">
                    {approvalInfo.approvalNote}
                  </p>
                </div>
              )}
              {approvalInfo.approvedAt && (
                <div className="pt-3 border-t border-chess-border font-inter text-xs text-chess-muted">
                  {t('forum:processing_time_label')} {new Date(approvalInfo.approvedAt).toLocaleString('vi-VN')}
                </div>
              )}
            </div>
          ) : status === 'PENDING' ? (
            <p className="font-inter text-sm text-chess-muted italic">
              {t('forum:pending_desc')}
            </p>
          ) : (
            <p className="font-inter text-sm text-chess-muted italic">{t('forum:no_more_notes')}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-chess-dark border-t border-chess-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-inter font-semibold text-chess-text bg-chess-surface border border-chess-border hover:bg-chess-border/50 rounded-lg transition-colors focus:outline-none"
          >
            {t('forum:close')}
          </button>
        </div>
      </div>
    </div>
  );
}
