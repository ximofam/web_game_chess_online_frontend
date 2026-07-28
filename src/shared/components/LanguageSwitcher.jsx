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
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#373d4e] bg-[#1c1f28] hover:bg-[#252a35] hover:border-[#d4af37]/40 transition-colors text-sm font-semibold text-[#9ca3af] hover:text-[#d4af37]"
      title={t('common:switch_language')}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{i18n.language === 'vi' ? 'VI' : 'EN'}</span>
    </button>
  );
}
