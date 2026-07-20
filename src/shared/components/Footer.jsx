import { useTranslation } from 'react-i18next';

/**
 * Reusable Footer component for Chess Arena pages.
 */
export const Footer = () => {
  const { t } = useTranslation('nav');
  return (
    <footer className="w-full border-t border-[#2d323f] bg-[#13161c] px-6 py-4 text-center text-xs text-[#9ca3af]">
      <span>{t('nav:footer_rights')}</span>
    </footer>
  );
};

export default Footer;
