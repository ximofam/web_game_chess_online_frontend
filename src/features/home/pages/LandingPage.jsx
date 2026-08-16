import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Zap, MessageSquare, UserCheck, ArrowRight, Sparkles, Award } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';

/**
 * LandingPage - Default introduction page for unauthenticated visitors.
 * Features hero showcase, guest quick start, feature highlights, and forum preview.
 */
export const LandingPage = () => {
  const { t } = useTranslation(['home']);
  const { loginGuest, showToast } = useAuth();
  const navigate = useNavigate();

  const handlePlayAsGuest = async () => {
    try {
      await loginGuest();
      showToast('Chào mừng bạn trải nghiệm với tư cách Khách (Guest)!', 'success');
      navigate('/dashboard');
    } catch (_err) {
      showToast('Không thể khởi tạo phiên Khách. Vui lòng thử lại.', 'error');
    }
  };

  return (
    <div className="w-full bg-chess-dark text-chess-text min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-x-hidden select-none">
      {/* HERO SECTION */}
      <section className="w-full py-24 px-6 md:px-12 flex flex-col items-center justify-center text-center border-b border-chess-border">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-chess-surface border border-chess-border text-chess-gold text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-4 h-4" />
          <span className="font-inter">{t('home:hero_badge')}</span>
        </div>

        {/* Main Title & Subtitle */}
        <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-chess-text max-w-4xl leading-tight mb-6">
          {t('home:hero_title_line1')} <br className="hidden sm:inline" />
          <span className="text-chess-gold">
            {t('home:hero_title_line2')}
          </span>
        </h1>

        <p className="font-inter text-base sm:text-lg text-chess-muted max-w-2xl leading-relaxed mb-10">
          {t('home:hero_subtitle')}
        </p>

        {/* Hero CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center">
          <button
            onClick={handlePlayAsGuest}
            className="w-full sm:w-auto bg-chess-gold text-chess-dark font-bold py-3.5 px-7 rounded-lg hover:bg-chess-gold-hover transition-colors duration-200 flex items-center justify-center gap-2.5 cursor-pointer text-sm tracking-wide font-inter"
          >
            <UserCheck className="w-5 h-5" />
            <span>{t('home:play_as_guest_btn')}</span>
          </button>

          <Link
            to="/login"
            className="w-full sm:w-auto bg-transparent border border-chess-border text-chess-text hover:border-chess-gold font-bold py-3.5 px-7 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer font-inter"
          >
            <span>{t('home:sign_in_btn')}</span>
            <ArrowRight className="w-4 h-4 text-chess-gold" />
          </Link>
        </div>

        {/* Visual Flat Chess Queen SVG Graphic */}
        <div className="mt-16 flex items-center justify-center">
          <div className="w-32 h-32 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-24 h-24 md:w-32 md:h-32 fill-chess-gold opacity-90"
            >
              <path d="M19 22H5v-2h14v2M17 18H7v-2h10v2M13 2h-2v2H9v2h2v2h2V6h2V4h-2V2m-1 7c2.2 0 4 1.8 4 4v1H8v-1c0-2.2 1.8-4 4-4z" />
            </svg>
          </div>
        </div>
      </section>

      {/* FEATURES SHOWCASE SECTION */}
      <section className="w-full py-24 px-6 md:px-12 bg-chess-dark border-b border-chess-border flex justify-center">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl font-bold text-chess-text mb-4">
              {t('home:features_title')}
            </h2>
            <p className="text-sm text-chess-muted max-w-xl mx-auto font-inter">
              {t('home:features_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Realtime Matchmaking */}
            <div className="bg-chess-surface border border-chess-border p-8 rounded-lg hover:border-chess-gold transition-colors duration-200 flex flex-col gap-4 shadow-md">
              <div className="w-12 h-12 rounded-lg bg-chess-dark border border-chess-border flex items-center justify-center text-chess-gold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-chess-text m-0">
                {t('home:feat_stomp_title')}
              </h3>
              <p className="font-inter text-sm text-chess-muted leading-relaxed">
                {t('home:feat_stomp_desc')}
              </p>
            </div>

            {/* Feature 2: Elo Rating System */}
            <div className="bg-chess-surface border border-chess-border p-8 rounded-lg hover:border-chess-gold transition-colors duration-200 flex flex-col gap-4 shadow-md">
              <div className="w-12 h-12 rounded-lg bg-chess-dark border border-chess-border flex items-center justify-center text-chess-gold">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-chess-text m-0">
                {t('home:feat_elo_title')}
              </h3>
              <p className="font-inter text-sm text-chess-muted leading-relaxed">
                {t('home:feat_elo_desc')}
              </p>
            </div>

            {/* Feature 3: Tactical Forum */}
            <div className="bg-chess-surface border border-chess-border p-8 rounded-lg hover:border-chess-gold transition-colors duration-200 flex flex-col gap-4 shadow-md">
              <div className="w-12 h-12 rounded-lg bg-chess-dark border border-chess-border flex items-center justify-center text-chess-gold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-chess-text m-0">
                {t('home:feat_forum_title')}
              </h3>
              <p className="font-inter text-sm text-chess-muted leading-relaxed mb-2">
                {t('home:feat_forum_desc')}
              </p>
              <Link
                to="/forum"
                className="font-inter text-sm font-semibold text-chess-gold hover:text-chess-gold-hover flex items-center gap-1 mt-auto"
              >
                <span>{t('home:view_forum')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="w-full py-16 px-6 bg-chess-dark flex justify-center text-center">
        <div className="max-w-2xl flex flex-col items-center gap-6">
          <Award className="w-12 h-12 text-chess-gold" />
          <h2 className="font-playfair text-2xl font-bold text-chess-text">
            {t('home:cta_ready_title')}
          </h2>
          <p className="font-inter text-sm text-chess-muted leading-relaxed">
            {t('home:cta_ready_desc')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <button
              onClick={handlePlayAsGuest}
              className="bg-chess-gold text-chess-dark font-inter font-bold text-sm py-3 px-6 rounded-lg hover:bg-chess-gold-hover transition-colors cursor-pointer"
            >
              {t('home:quick_guest_btn')}
            </button>
            <Link
              to="/register"
              className="bg-transparent border border-chess-border text-chess-text font-inter font-bold text-sm py-3 px-6 rounded-lg hover:border-chess-gold transition-colors"
            >
              {t('home:register_new_account')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
