import React, { useState } from 'react';
import { useAuth } from '../auth/context/AuthContext';
import { authService } from '../auth/services/authService';
import { setAccessToken } from '../auth/api/authClient';
import { LogOut, RefreshCw, Shield, User, Trophy, Play, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, logout, refreshToken, showToast } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const handleTestProtectedApi = async () => {
    setIsLoadingProfile(true);
    try {
      const data = await authService.getProfile();
      setProfileData(data);
      showToast('Protected data fetched successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch protected data.', 'error');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Simulates token expiry by clearing the in-memory access token.
  // The next request will trigger a 401, which should automatically invoke
  // the Axios interceptor to refresh the token transparently, storing the new token and re-trying.
  const handleSimulateTokenExpiry = async () => {
    // Clear access token in memory (mimics JWT expiration)
    setAccessToken(null);
    showToast('In-memory Access Token cleared. Simulating expiration...', 'success');
    
    // Now trigger a protected API call immediately.
    // The Axios interceptor should detect the 401, request a new token via /api/auth/refresh,
    // save the token in memory, and successfully complete this API call!
    setIsLoadingProfile(true);
    try {
      const data = await authService.getProfile();
      setProfileData(data);
      showToast('Interceptor automatically refreshed token and completed request!', 'success');
    } catch (err) {
      showToast('Failed to auto-refresh token.', 'error');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0d0e12] flex flex-col justify-between select-none">
      {/* HEADER */}
      <header className="border-b border-chess-border bg-[#13161c] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Trophy className="w-6 h-6 text-chess-gold animate-bounce" />
          <h1 className="font-playfair text-lg font-bold tracking-widest text-chess-text m-0!">
            CHESS ARENA
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-chess-text">{currentUser?.username}</span>
            <span className="text-[10px] uppercase tracking-wider text-chess-gold font-medium">{currentUser?.rank}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/40 border border-red-500/30 hover:bg-red-900/40 hover:border-red-500/60 text-xs font-semibold text-red-200 transition-all cursor-pointer"
            aria-label="Log out of session"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </header>

      {/* BODY */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* PROFILE SUMMARY */}
          <div className="md:col-span-5 bg-chess-surface border border-chess-border p-6 rounded-xl flex flex-col justify-between">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full border-2 border-chess-gold flex items-center justify-center bg-chess-dark text-chess-gold mb-4 relative">
                <User className="w-10 h-10" />
                <span className="absolute bottom-0 right-0 bg-[#d4af37] text-[#0d0e12] rounded-full p-1 border border-chess-surface">
                  <Shield className="w-3 h-3" />
                </span>
              </div>
              <h2 className="font-playfair text-2xl font-bold text-chess-text">{currentUser?.username}</h2>
              <p className="text-xs text-chess-muted tracking-wider uppercase mb-1">{currentUser?.email}</p>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-chess-gold/10 border border-chess-gold/30 text-chess-gold mt-2">
                <CheckCircle className="w-3.5 h-3.5" /> {currentUser?.rank}
              </span>
            </div>

            <div className="border-t border-chess-border mt-6 pt-6 grid grid-cols-3 gap-2 text-center">
              <div className="bg-chess-dark/40 py-2.5 rounded border border-chess-border/60">
                <span className="block text-lg font-bold text-chess-text">142</span>
                <span className="text-[10px] text-chess-muted uppercase">Wins</span>
              </div>
              <div className="bg-chess-dark/40 py-2.5 rounded border border-chess-border/60">
                <span className="block text-lg font-bold text-chess-text">32</span>
                <span className="text-[10px] text-chess-muted uppercase">Draws</span>
              </div>
              <div className="bg-chess-dark/40 py-2.5 rounded border border-chess-border/60">
                <span className="block text-lg font-bold text-chess-text">12</span>
                <span className="text-[10px] text-chess-muted uppercase">Losses</span>
              </div>
            </div>
          </div>

          {/* PLAY AND ACTIONS */}
          <div className="md:col-span-7 bg-chess-surface border border-chess-border p-6 rounded-xl flex flex-col justify-between">
            <div>
              <h3 className="font-playfair text-xl font-bold text-chess-text mb-2">Tournament Lobby</h3>
              <p className="text-sm text-chess-muted mb-6 leading-relaxed">
                Welcome to the official lobby. You can play quick matches against online players or query tournament details.
              </p>

              {/* ACTION BUTTONS */}
              <div className="space-y-3">
                <button
                  onClick={handleTestProtectedApi}
                  disabled={isLoadingProfile}
                  className="w-full bg-chess-dark hover:bg-chess-border border border-chess-border text-chess-text font-semibold py-3 px-4 rounded-lg flex items-center justify-between text-sm transition-all focus:ring-1 focus:ring-chess-gold focus:outline-none cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-chess-gold" />
                    Query Player Protected Profile
                  </span>
                  {isLoadingProfile ? (
                    <RefreshCw className="w-4 h-4 text-chess-gold animate-spin" />
                  ) : (
                    <span className="text-xs text-chess-gold">GET /profile</span>
                  )}
                </button>

                <button
                  onClick={handleSimulateTokenExpiry}
                  disabled={isLoadingProfile}
                  className="w-full bg-chess-dark hover:bg-chess-border border border-chess-border text-chess-text font-semibold py-3 px-4 rounded-lg flex items-center justify-between text-sm transition-all focus:ring-1 focus:ring-chess-gold focus:outline-none cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-chess-gold" />
                    Simulate Token Expiration & Auto-Refresh
                  </span>
                  <span className="text-xs text-chess-gold">POST /refresh</span>
                </button>
              </div>

              {/* API OUTPUT RENDER */}
              {profileData && (
                <div className="mt-4 p-4 rounded-lg bg-chess-dark border border-chess-border animate-fade-in text-left">
                  <span className="text-[10px] text-chess-gold uppercase font-semibold tracking-wider block mb-1">
                    API Response: /api/protected/profile
                  </span>
                  <pre className="text-xs font-mono text-chess-text overflow-x-auto">
                    {JSON.stringify(profileData, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <button
              onClick={() => showToast('Matchmaking search initiated...', 'success')}
              className="w-full bg-chess-gold text-chess-dark font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-chess-gold-hover hover:shadow-[0_4px_12px_rgba(212,175,55,0.25)] transition-all cursor-pointer mt-6"
            >
              <Play className="w-4 h-4 fill-chess-dark" />
              <span>FIND QUICK MATCH (RATED)</span>
            </button>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-chess-border bg-[#13161c] px-6 py-4 text-center text-xs text-chess-muted">
        <span>© 2026 CHESS ARENA. ALL RIGHTS RESERVED. ACCESSIBILITY READY.</span>
      </footer>
    </div>
  );
}
