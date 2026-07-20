import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Zap, MessageSquare, ShieldCheck, UserCheck, ArrowRight, Sparkles, Award } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';

/**
 * LandingPage - Default introduction page for unauthenticated visitors.
 * Features hero showcase, guest quick start, feature highlights, and forum preview.
 */
export const LandingPage = () => {
  const { loginGuest, showToast } = useAuth();
  const navigate = useNavigate();

  const handlePlayAsGuest = async () => {
    try {
      await loginGuest();
      showToast('Chào mừng bạn trải nghiệm với tư cách Khách (Guest)!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast('Không thể khởi tạo phiên Khách. Vui lòng thử lại.', 'error');
    }
  };

  return (
    <div className="w-full bg-[#0d0e12] text-[#f3f4f6] min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-x-hidden select-none">
      {/* HERO SECTION */}
      <section className="relative w-full py-16 md:py-24 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden border-b border-[#2d323f]/60">
        {/* Subtle grid background pattern with radial gold glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#2d323f_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1f28] border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-6 z-10 animate-fade-in shadow-lg">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span>Đấu trường Cờ Vua Realtime</span>
        </div>

        {/* Main Title & Subtitle */}
        <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f3f4f6] max-w-4xl leading-tight z-10 mb-6">
          Master the Board. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#d4af37] via-[#f3cd57] to-[#b59226] bg-clip-text text-transparent">
            Dominate the Arena.
          </span>
        </h1>

        <p className="font-inter text-base sm:text-lg text-[#9ca3af] max-w-2xl leading-relaxed mb-10 z-10">
          Trải nghiệm hệ thống đấu cờ vua trực tuyến hiện đại với tốc độ truyền tải realtime, 
          hệ thống tính điểm Elo chuẩn quốc tế và diễn đàn phân tích thế cờ chuyên sâu.
        </p>

        {/* Hero CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full max-w-md justify-center">
          <button
            onClick={handlePlayAsGuest}
            className="w-full sm:w-auto bg-[#d4af37] text-[#0d0e12] font-bold py-3.5 px-7 rounded-xl hover:bg-[#f3cd57] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer text-sm tracking-wide shadow-md"
          >
            <UserCheck className="w-5 h-5" />
            <span>PLAY AS GUEST</span>
          </button>

          <Link
            to="/login"
            className="w-full sm:w-auto bg-[#1a1d24] border border-[#373d4e] text-[#f3f4f6] hover:bg-[#252a35] hover:border-[#d4af37]/50 font-bold py-3.5 px-7 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer shadow-md"
          >
            <span>SIGN IN TO PLAY</span>
            <ArrowRight className="w-4 h-4 text-[#d4af37]" />
          </Link>
        </div>

        {/* Visual Floating Chess Queen SVG Graphic */}
        <div className="mt-14 relative z-10 flex items-center justify-center">
          <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#d4af37]/15 rounded-full blur-2xl animate-pulse" />
            <svg
              viewBox="0 0 24 24"
              className="w-32 h-32 md:w-36 md:h-36 fill-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-bounce duration-[3000ms]"
            >
              <path d="M19 22H5v-2h14v2M17 18H7v-2h10v2M13 2h-2v2H9v2h2v2h2V6h2V4h-2V2m-1 7c2.2 0 4 1.8 4 4v1H8v-1c0-2.2 1.8-4 4-4z" />
            </svg>
          </div>
        </div>
      </section>

      {/* FEATURES SHOWCASE SECTION */}
      <section className="w-full py-16 px-6 md:px-12 bg-[#13161c] border-b border-[#2d323f]/60 flex justify-center">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#f3f4f6] mb-3">
              Tính năng Nổi bật
            </h2>
            <p className="text-sm text-[#9ca3af] max-w-xl mx-auto">
              Được thiết kế cho kỳ thủ ở mọi trình độ – từ đấu tập giao hữu đến giải đấu xếp hạng đỉnh cao.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Realtime Matchmaking */}
            <div className="bg-[#1a1d24] border border-[#2d323f] p-6 rounded-2xl hover:border-[#d4af37]/50 transition-all duration-300 flex flex-col gap-4 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-[#f3f4f6] m-0">
                STOMP WebSocket Realtime
              </h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Kết nối thi đấu với độ trễ tối thiểu thông qua giao thức WebSocket và Pub/Sub Message Relay tự động.
              </p>
            </div>

            {/* Feature 2: Elo Rating System */}
            <div className="bg-[#1a1d24] border border-[#2d323f] p-6 rounded-2xl hover:border-[#d4af37]/50 transition-all duration-300 flex flex-col gap-4 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-[#f3f4f6] m-0">
                Xếp hạng & Elo Bảng điểm
              </h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Hệ thống tính điểm Elo chuẩn xác theo chuẩn FIDE, giúp bạn theo dõi đà tăng trưởng kỹ năng cờ vua.
              </p>
            </div>

            {/* Feature 3: Tactical Forum */}
            <div className="bg-[#1a1d24] border border-[#2d323f] p-6 rounded-2xl hover:border-[#d4af37]/50 transition-all duration-300 flex flex-col gap-4 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-[#f3f4f6] m-0">
                Diễn đàn Phân tích Thế cờ
              </h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed mb-1">
                Giao lưu, chia sẻ bài viết chiến thuật và thảo luận về các ván cờ kinh điển cùng cộng đồng kỳ thủ.
              </p>
              <Link
                to="/forum"
                className="text-xs font-semibold text-[#d4af37] hover:underline flex items-center gap-1 mt-auto"
              >
                <span>Xem Diễn đàn</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="w-full py-12 px-6 bg-[#0d0e12] flex justify-center text-center">
        <div className="max-w-2xl flex flex-col items-center gap-4">
          <Award className="w-10 h-10 text-[#d4af37]" />
          <h2 className="font-playfair text-2xl font-bold text-[#f3f4f6]">
            Sẵn sàng nhập cuộc Đấu trường?
          </h2>
          <p className="text-xs text-[#9ca3af] leading-relaxed">
            Đăng ký tài khoản Chess Arena hoặc tham gia ngay lập tức dưới dạng Khách để bắt đầu trận đấu đầu tiên.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <button
              onClick={handlePlayAsGuest}
              className="bg-[#d4af37] text-[#0d0e12] font-bold text-xs py-2.5 px-5 rounded-lg hover:bg-[#f3cd57] transition-all cursor-pointer"
            >
              CHƠI NHANH VỚI KHÁCH
            </button>
            <Link
              to="/register"
              className="bg-[#242834] border border-[#373d4e] text-[#f3f4f6] font-bold text-xs py-2.5 px-5 rounded-lg hover:bg-[#2d3242] transition-all"
            >
              ĐĂNG KÝ TÀI KHOẢN MỚI
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
