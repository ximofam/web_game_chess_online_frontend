import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation(['common']);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-chess-border bg-chess-surface hover:bg-chess-border/50 hover:border-chess-gold/40 transition-colors text-sm font-inter font-semibold text-chess-muted hover:text-chess-gold focus:outline-none focus:ring-2 focus:ring-chess-gold focus:ring-offset-2 focus:ring-offset-chess-dark cursor-pointer"
      title={t('common:switch_language')}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{i18n.language === 'vi' ? 'VI' : 'EN'}</span>
    </button>
  );
}
