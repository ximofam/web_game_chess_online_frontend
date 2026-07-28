import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Ghost, Home, Search } from 'lucide-react';

const NotFoundPage = () => {
  const { t } = useTranslation(['error']);

  return (
    <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center p-6 text-slate-100">
      <div className="max-w-md w-full text-center space-y-8 relative">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-5 bg-rose-500/10 rounded-3xl border border-rose-500/20 text-rose-500 shadow-xl mb-6 transform hover:scale-110 transition-transform duration-500">
            <Ghost className="w-16 h-16" />
          </div>
          
          <h1 className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-500 mb-2">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">{t('error:not_found_title', 'Page Not Found')}</h2>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
            {t('error:not_found_desc', "The page you're looking for seems to have vanished into the void. Let's get you back on track.")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-400/20 transition-all transform hover:-translate-y-0.5"
            >
              <Home className="w-4 h-4" />
              {t('error:back_to_home', 'Back to Home')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
