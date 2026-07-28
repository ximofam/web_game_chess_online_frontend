import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

const ForbiddenPage = () => {
  const { t } = useTranslation(['error']);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center p-6 text-slate-100">
      <div className="max-w-md w-full text-center space-y-8 relative">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-5 bg-rose-500/10 rounded-3xl border border-rose-500/20 text-rose-500 shadow-xl mb-6">
            <ShieldAlert className="w-16 h-16 animate-pulse" />
          </div>
          
          <h1 className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600 mb-2">
            403
          </h1>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">{t('error:forbidden_title', 'Access Denied')}</h2>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
            {t('error:forbidden_desc', "You don't have permission to access this area. Please contact an administrator if you believe this is a mistake.")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('error:go_back', 'Go Back')}
            </button>
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

export default ForbiddenPage;
