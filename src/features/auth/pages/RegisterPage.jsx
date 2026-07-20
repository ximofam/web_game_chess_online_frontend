import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ShieldAlert, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { registerSchema } from '../validation/authSchemas';
import AuthInput from '../components/AuthInput';

export default function RegisterPage() {
  const { t } = useTranslation(['auth', 'common', 'nav']);
  const { showToast } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resolver = async (values) => {
    const result = registerSchema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }
    const errors = {};
    result.error.issues.forEach((err) => {
      errors[err.path[0]] = {
        type: 'validation',
        message: err.message,
      };
    });
    return { values: {}, errors };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver,
    mode: 'onTouched',
  });

  const { mutate: registerUser, isPending, error: serverError } = useMutation({
    mutationFn: async ({ username, email, password }) => {
      return authService.register(username, email, password);
    },
    onSuccess: (data) => {
      showToast(data.message || t('auth:account_registered_toast'), 'success');
      navigate('/login');
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || t('common:something_went_wrong');
      showToast(errMsg, 'error');
    },
  });

  const onSubmit = (data) => {
    registerUser(data);
  };

  return (
    <main className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-chess-dark">
      {/* LEFT PANE - Beautiful Chess Scene (Desktop Only) */}
      <section className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-[#13161c] border-r border-chess-border relative flex-col items-center justify-between p-12 select-none">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#2d323f_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        
        {/* Championship Brand */}
        <div className="w-full flex items-center gap-2.5 z-10">
          <Award className="w-7 h-7 text-chess-gold" />
          <h1 className="font-playfair text-xl font-bold tracking-widest text-chess-text m-0!">
            {t('nav:brand')}
          </h1>
        </div>

        {/* Hero visual */}
        <div className="flex flex-col items-center justify-center text-center z-10 my-auto">
          {/* Glowing float Chess piece SVG */}
          <div className="w-48 h-48 mb-8 relative flex items-center justify-center animate-pulse duration-[3000ms]">
            <div className="absolute inset-0 bg-chess-gold/10 rounded-full blur-3xl" />
            <svg viewBox="0 0 24 24" className="w-36 h-36 fill-chess-gold/90 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]">
              <path d="M19 22H5v-2h14v2M12 2C8.69 2 6 4.69 6 8c0 1.2.35 2.3 1 3.25V13c0 2 1.5 3.5 3.5 3.5.3 0 .5.1.7.3.2.2.3.4.3.7v1.5H8.5v2h7v-2H13.5v-1.5c0-.3.1-.5.3-.7.2-.2.4-.3.7-.3 2 0 3.5-1.5 3.5-3.5v-1.75c.65-.95 1-2.05 1-3.25 0-3.31-2.69-6-6-6m0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m-2.5 8c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 .3-.1.5-.3.7-.2.2-.4.3-.7.3h-1c-.55 0-1-.45-1-1z" />
            </svg>
          </div>

          <blockquote className="font-playfair italic text-2xl text-chess-text max-w-md mb-2 leading-relaxed">
            &quot;Every chess master was once a beginner.&quot;
          </blockquote>
          <cite className="text-xs uppercase tracking-widest text-chess-muted not-italic font-semibold">
            — Chernev
          </cite>
        </div>

        {/* Tournament Meta */}
        <div className="w-full flex items-center justify-between text-xs text-chess-muted z-10">
          <span>SERIES 2026</span>
          <span>ONLINE CHESS LOBBY</span>
        </div>
      </section>

      {/* RIGHT PANE - Form Card */}
      <section className="flex lg:col-span-6 xl:col-span-5 flex-col justify-center items-center px-6 py-12 md:px-12 relative">
        <div className="w-full max-w-md bg-chess-surface border border-chess-border/80 p-8 rounded-xl shadow-2xl relative">
          
          {/* Header Mobile Brand logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
            <Award className="w-6 h-6 text-chess-gold" />
            <span className="font-playfair text-lg font-bold tracking-widest text-chess-text">
              {t('nav:brand')}
            </span>
          </div>

          {/* Form Header */}
          <div className="text-center md:text-left mb-6">
            <h2 className="font-playfair text-3xl font-semibold text-chess-text mb-1">
              {t('auth:register_title')}
            </h2>
            <p className="text-sm text-chess-muted font-inter">
              {t('auth:register_subtitle')}
            </p>
          </div>

          {/* Server Side Error Banner */}
          {serverError && (
            <div
              className="flex items-center gap-2 bg-red-950/60 border border-red-500/40 p-3.5 rounded-lg text-xs text-red-200 mb-5 animate-shake"
              role="alert"
            >
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{serverError.response?.data?.message || t('common:something_went_wrong')}</span>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <AuthInput
              label={t('auth:username')}
              id="register-username"
              type="text"
              placeholder="e.g. Kasparov_01"
              error={errors.username}
              registration={register('username')}
              disabled={isPending}
            />

            <AuthInput
              label={t('auth:email')}
              id="register-email"
              type="email"
              placeholder="you@domain.com"
              error={errors.email}
              registration={register('email')}
              disabled={isPending}
            />

            <AuthInput
              label={t('auth:password')}
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password}
              registration={register('password')}
              disabled={isPending}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-chess-muted hover:text-chess-text focus:outline-none p-1 rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <AuthInput
              label={t('auth:confirm_password')}
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.confirmPassword}
              registration={register('confirmPassword')}
              disabled={isPending}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-chess-muted hover:text-[#f3f4f6] focus:outline-none p-1 rounded"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Submit Button */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isPending}
              className="w-full bg-chess-gold text-chess-dark font-semibold py-3 px-4 rounded transition-all duration-300 hover:bg-chess-gold-hover hover:shadow-[0_4px_12px_rgba(212,175,55,0.25)] focus:outline-none focus:ring-2 focus:ring-chess-gold focus:ring-offset-2 focus:ring-offset-chess-surface disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-chess-dark" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{t('auth:creating_account')}</span>
                </>
              ) : (
                <span>{t('auth:register_submit')}</span>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center mt-6 text-xs text-chess-muted">
            {t('auth:already_have_account')}{' '}
            <Link
              to="/login"
              className="text-chess-gold font-semibold hover:underline hover:text-chess-gold-hover focus:outline-none focus:underline"
            >
              {t('auth:sign_in_here')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
