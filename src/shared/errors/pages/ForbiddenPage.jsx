import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-zinc-950 overflow-hidden px-6">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Decorative Grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBoNDBNNDAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4=')] opacity-30 pointer-events-none" 
           style={{ maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)', WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)' }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        
        {/* Animated Icon */}
        <div className="mb-8 flex items-center justify-center w-24 h-24 rounded-full bg-zinc-900/50 border border-zinc-800 shadow-[0_0_30px_rgba(244,63,94,0.15)] animate-[pulse_3s_ease-in-out_infinite]">
          <ShieldAlert className="w-12 h-12 text-rose-500 opacity-90" strokeWidth={1.5} />
        </div>

        {/* Typography */}
        <h1 className="text-[8rem] sm:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-600 leading-none tracking-tighter mb-4 drop-shadow-sm">
          403
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-200 tracking-tight mb-4">
          Nước Đi Phạm Quy
        </h2>
        
        <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg">
          Bạn đang cố gắng thực hiện một nước đi không hợp lệ hoặc xâm nhập vào khu vực bị cấm. Trọng tài đã yêu cầu dừng ván cờ này.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            to="/" 
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-zinc-950 bg-rose-500 rounded-full overflow-hidden transition-all hover:bg-rose-400 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            <span className="relative z-10">Về Khu Môn Đệ</span>
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium text-zinc-300 bg-transparent border border-zinc-800 rounded-full transition-all hover:bg-zinc-800/50 hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Quay Lại Nước Trước
          </button>
        </div>
      </div>
    </div>
  );
}
