import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/context/AuthContext';
import { authService } from '../auth/services/authService';
import { setAccessToken } from '../auth/api/authClient';
import { RefreshCw, Shield, User, LogIn, Play, CheckCircle, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, isGuest, refreshToken, showToast } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const handleTestProtectedApi = async () => {
    setIsLoadingProfile(true);
    try {
      const data = await authService.getProfile();
      setProfileData(data);
      showToast('Lấy dữ liệu API thành công!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Không thể lấy dữ liệu protected API.', 'error');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSimulateTokenExpiry = async () => {
    setAccessToken(null);
    showToast('Đã xóa Access Token trong bộ nhớ. Giả lập hết hạn token...', 'success');

    setIsLoadingProfile(true);
    try {
      const data = await authService.getProfile();
      setProfileData(data);
      showToast('Interceptor đã tự động xoay vòng refresh token và hoàn tất request!', 'success');
    } catch (err) {
      showToast('Tự động refresh token thất bại.', 'error');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-10 select-none">
      <div className="w-full max-w-4xl space-y-6">

        {/* GUEST BANNER IF VISITING AS GUEST */}
        {isGuest && (
          <div className="bg-gradient-to-r from-[#d4af37]/15 via-[#1a1d24] to-[#242834] border border-[#d4af37]/40 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg animate-fade-in">
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-playfair font-bold text-lg text-[#f3f4f6]">
                  Bạn đang trải nghiệm với tư cách Khách (Guest)
                </h3>
                <p className="text-xs text-[#9ca3af]">
                  Bạn có thể xem thông tin trang chủ và diễn đàn. Đăng nhập tài khoản để lưu thành tích thi đấu và bài viết!
                </p>
              </div>
            </div>

            <Link
              to="/login"
              className="bg-[#d4af37] text-[#0d0e12] hover:bg-[#b59226] font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập ngay</span>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* PROFILE SUMMARY */}
          <div className="md:col-span-5 bg-[#1a1d24] border border-[#2d323f] p-6 rounded-2xl flex flex-col justify-between shadow-md">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full border-2 border-[#d4af37] flex items-center justify-center bg-[#13161c] text-[#d4af37] mb-4 relative overflow-hidden shadow-inner">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10" />
                )}
                <span className="absolute bottom-0 right-0 bg-[#d4af37] text-[#0d0e12] rounded-full p-1 border border-[#1a1d24]">
                  <Shield className="w-3 h-3" />
                </span>
              </div>
              <h2 className="font-playfair text-2xl font-bold text-[#f3f4f6]">{currentUser?.username || 'Guest Player'}</h2>
              <p className="text-xs text-[#9ca3af] tracking-wider uppercase mb-1">{currentUser?.email || 'Hệ thống Khách Ẩn Danh'}</p>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] mt-2">
                <CheckCircle className="w-3.5 h-3.5" /> {currentUser?.role || 'GUEST'}
              </span>
            </div>

            <div className="border-t border-[#2d323f] mt-6 pt-6 grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#13161c]/60 py-2.5 rounded-lg border border-[#2d323f]">
                <span className="block text-lg font-bold text-[#f3f4f6]">142</span>
                <span className="text-[10px] text-[#9ca3af] uppercase">Wins</span>
              </div>
              <div className="bg-[#13161c]/60 py-2.5 rounded-lg border border-[#2d323f]">
                <span className="block text-lg font-bold text-[#f3f4f6]">32</span>
                <span className="text-[10px] text-[#9ca3af] uppercase">Draws</span>
              </div>
              <div className="bg-[#13161c]/60 py-2.5 rounded-lg border border-[#2d323f]">
                <span className="block text-lg font-bold text-[#f3f4f6]">12</span>
                <span className="text-[10px] text-[#9ca3af] uppercase">Losses</span>
              </div>
            </div>
          </div>

          {/* PLAY AND ACTIONS */}
          <div className="md:col-span-7 bg-[#1a1d24] border border-[#2d323f] p-6 rounded-2xl flex flex-col justify-between shadow-md">
            <div>
              <h3 className="font-playfair text-xl font-bold text-[#f3f4f6] mb-2">Đấu trường Cờ vua Online</h3>
              <p className="text-sm text-[#9ca3af] mb-6 leading-relaxed">
                Chào mừng bạn đến với hệ thống. Khách và người dùng có thể tham gia sảnh chờ, xem danh sách bài viết trên diễn đàn hoặc tìm trận đấu nhanh.
              </p>

              {/* ACTION BUTTONS */}
              <div className="space-y-3">
                <button
                  onClick={handleTestProtectedApi}
                  disabled={isLoadingProfile}
                  className="w-full bg-[#13161c] hover:bg-[#242834] border border-[#2d323f] text-[#f3f4f6] font-semibold py-3 px-4 rounded-xl flex items-center justify-between text-sm transition-all focus:ring-1 focus:ring-[#d4af37] focus:outline-none cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#d4af37]" />
                    Kiểm tra Protected Profile API
                  </span>
                  {isLoadingProfile ? (
                    <RefreshCw className="w-4 h-4 text-[#d4af37] animate-spin" />
                  ) : (
                    <span className="text-xs text-[#d4af37] font-mono">GET /profile</span>
                  )}
                </button>

                <button
                  onClick={handleSimulateTokenExpiry}
                  disabled={isLoadingProfile}
                  className="w-full bg-[#13161c] hover:bg-[#242834] border border-[#2d323f] text-[#f3f4f6] font-semibold py-3 px-4 rounded-xl flex items-center justify-between text-sm transition-all focus:ring-1 focus:ring-[#d4af37] focus:outline-none cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#d4af37]" />
                    Giả lập Token Rotation (Auto Refresh)
                  </span>
                  <span className="text-xs text-[#d4af37] font-mono">POST /refresh</span>
                </button>
              </div>

              {/* API OUTPUT RENDER */}
              {profileData && (
                <div className="mt-4 p-4 rounded-xl bg-[#13161c] border border-[#2d323f] animate-fade-in text-left">
                  <span className="text-[10px] text-[#d4af37] uppercase font-semibold tracking-wider block mb-1">
                    API Response: /api/protected/profile
                  </span>
                  <pre className="text-xs font-mono text-[#f3f4f6] overflow-x-auto">
                    {JSON.stringify(profileData, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <button
              onClick={() => showToast('Đang tìm kiếm trận đấu nhanh...', 'success')}
              className="w-full bg-[#d4af37] text-[#0d0e12] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#b59226] hover:shadow-[0_4px_12px_rgba(212,175,55,0.25)] transition-all cursor-pointer mt-6"
            >
              <Play className="w-4 h-4 fill-[#0d0e12]" />
              <span>TÌM TRẬN ĐẤU NHANH (RATED)</span>
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
