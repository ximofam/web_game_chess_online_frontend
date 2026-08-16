import { AlertCircle, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * ErrorState visualizes query failures and offers a retry trigger.
 */
export const ErrorState = ({ message, onRetry }) => {
  const { t } = useTranslation(['profile']);
  return (
    <div className="w-full max-w-lg bg-chess-surface border border-red-500/30 p-8 rounded-lg flex flex-col items-center text-center shadow-md select-none">
      <div className="w-12 h-12 bg-red-950/40 rounded-full flex items-center justify-center border border-red-500/40 text-red-500 mb-4 animate-bounce">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-playfair text-xl font-bold text-chess-text mb-2">
        {t('profile:errorState.title', 'Tactical Error Encountered')}
      </h3>
      <p className="font-inter text-sm text-chess-muted mb-6 leading-relaxed max-w-sm">
        {message || t('profile:errorState.defaultMessage', 'Failed to fetch player details from the server.')}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-chess-gold text-chess-dark font-inter font-bold py-2.5 px-5 rounded-lg hover:bg-chess-gold-hover transition-colors cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-chess-gold focus:ring-offset-2 focus:ring-offset-chess-dark"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('profile:errorState.retry', 'RETRY ACTION')}</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
