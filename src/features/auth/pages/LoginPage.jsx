import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, ShieldAlert, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../validation/authSchemas';
import AuthInput from '../components/AuthInput';

export default function LoginPage() {
  const { login, showToast } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Custom zod resolver to avoid extra @hookform/resolvers dependency
  const resolver = async (values) => {
    const result = loginSchema.safeParse(values);
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
      usernameOrEmail: '',
      password: '',
    },
    resolver,
    mode: 'onTouched',
  });

  // TanStack Query mutation for login request
  const { mutate: performLogin, isPending, error: serverError } = useMutation({
    mutationFn: async ({ usernameOrEmail, password }) => {
      return login(usernameOrEmail, password);
    },
    onSuccess: () => {
      navigate('/dashboard');
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your network or credentials.';
      showToast(errMsg, 'error');
    },
  });

  const onSubmit = (data) => {
    performLogin(data);
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
            CHESS ARENA
          </h1>
        </div>

        {/* Hero visual */}
        <div className="flex flex-col items-center justify-center text-center z-10 my-auto">
          {/* Glowing float Chess Queen piece SVG */}
          <div className="w-48 h-48 mb-8 relative flex items-center justify-center animate-pulse duration-[3500ms]">
            <div className="absolute inset-0 bg-chess-gold/10 rounded-full blur-3xl" />
            <svg viewBox="0 0 24 24" className="w-36 h-36 fill-chess-gold/90 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]">
              <path d="M19 22H5v-2h14v2M17 18H7v-2h10v2m1-4h-9.5l-2.2-2.2c-.5-.5-.8-1.2-.8-1.9V8c0-1.1.9-2 2-2h1.5l1-3.5c.3-.9 1.1-1.5 2-1.5s1.7.6 2 1.5l.5 1.7 2.5 2c1 .8 1.5 2 1.5 3.3V14c0 1.1-.9 2-2 2z" />
            </svg>
          </div>

          <blockquote className="font-playfair italic text-2xl text-chess-text max-w-md mb-2 leading-relaxed">
            "Play the opening like a book, the middlegame like a magician, and the endgame like a machine."
          </blockquote>
          <cite className="text-xs uppercase tracking-widest text-chess-muted not-italic font-semibold">
            — Spielmann
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
              CHESS ARENA
            </span>
          </div>

          {/* Form Header */}
          <div className="text-center md:text-left mb-6">
            <h2 className="font-playfair text-3xl font-semibold text-chess-text mb-1">
              Sign In
            </h2>
            <p className="text-sm text-chess-muted font-inter">
              Enter your credentials to enter the arena.
            </p>
          </div>

          {/* Server Side Error Banner */}
          {serverError && (
            <div
              className="flex items-center gap-2 bg-red-950/60 border border-red-500/40 p-3.5 rounded-lg text-xs text-red-200 mb-5 animate-shake"
              role="alert"
            >
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{serverError.response?.data?.message || 'Unauthorized entry.'}</span>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <AuthInput
              label="Username or Email"
              id="login-username"
              type="text"
              placeholder="Kasparov_01 or you@domain.com"
              error={errors.usernameOrEmail}
              registration={register('usernameOrEmail')}
              disabled={isPending}
            />

            <AuthInput
              label="Password"
              id="login-password"
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

            {/* Submit Button */}
            <button
              id="login-submit-btn"
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
                  <span>SIGNING IN...</span>
                </>
              ) : (
                <span>LOG IN TO BATTLE</span>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center mt-6 text-xs text-chess-muted">
            New player?{' '}
            <Link
              to="/register"
              className="text-chess-gold font-semibold hover:underline hover:text-chess-gold-hover focus:outline-none focus:underline"
            >
              Register Chess ID
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
