import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserCheck, LogIn, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function GuestChoiceModal({ isOpen, onClose }) {
  const { t } = useTranslation(['auth']);
  const { loginGuest, showToast } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleContinueAsGuest = async () => {
    try {
      await loginGuest();
      showToast(t('auth:guest_toast_success'), 'success');
      if (onClose) onClose();
    } catch (err) {
      showToast(t('auth:guest_toast_error'), 'error');
    }
  };

  const handleGoToLogin = () => {
    if (onClose) onClose();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-[#181b22] border border-[#2d323f] text-[#f3f4f6] rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
        <div className="w-14 h-14 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <h3 className="font-playfair text-2xl font-bold text-center mb-2 text-[#f3f4f6]">
          {t('auth:welcome_title')}
        </h3>
        <p className="text-sm text-[#9ca3af] text-center mb-6 leading-relaxed">
          {t('auth:welcome_desc_1')}<strong className="text-[#d4af37]">{t('auth:welcome_desc_2')}</strong>{t('auth:welcome_desc_3')}<strong className="text-[#d4af37]">{t('auth:welcome_desc_4')}</strong>{t('auth:welcome_desc_5')}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleContinueAsGuest}
            className="w-full bg-[#d4af37] text-[#0d0e12] hover:bg-[#b59226] font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <UserCheck className="w-5 h-5" />
            <span>{t('auth:continue_as_guest')}</span>
          </button>

          <button
            onClick={handleGoToLogin}
            className="w-full bg-[#242834] border border-[#373d4e] hover:bg-[#2d3242] text-[#f3f4f6] font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogIn className="w-5 h-5 text-[#d4af37]" />
            <span>{t('auth:login_account')}</span>
          </button>
        </div>

        <div className="mt-5 text-center text-xs text-[#6b7280]">
          {t('auth:guest_disclaimer')}
        </div>
      </div>
    </div>
  );
}
