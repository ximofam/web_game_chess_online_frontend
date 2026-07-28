import { Link } from 'react-router-dom';
import { Ghost, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-zinc-950 overflow-hidden px-6">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Decorative Grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBoNDBNNDAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4=')] opacity-30 pointer-events-none mask-image-radial-gradient" 
           style={{ maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)', WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)' }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        
        {/* Animated Icon */}
        <div className="mb-8 flex items-center justify-center w-24 h-24 rounded-full bg-zinc-900/50 border border-zinc-800 shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-[bounce_4s_ease-in-out_infinite]">
          <Ghost className="w-12 h-12 text-emerald-400 opacity-80" strokeWidth={1.5} />
        </div>

        {/* Typography */}
        <h1 className="text-[8rem] sm:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-600 leading-none tracking-tighter mb-4 drop-shadow-sm">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-200 tracking-tight mb-4">
          Ô Cờ Nằm Ngoài Bản Đồ
        </h2>
        
        <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg">
          Nước đi của bạn vừa vượt ra khỏi giới hạn của bàn cờ. Không có quân cờ, không có chiến thuật nào có thể thi triển ở tọa độ này.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            to="/" 
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-zinc-950 bg-emerald-400 rounded-full overflow-hidden transition-all hover:bg-emerald-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            <span className="relative z-10">Trở Về Bàn Cờ</span>
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium text-zinc-300 bg-transparent border border-zinc-800 rounded-full transition-all hover:bg-zinc-800/50 hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Đi Lại Nước Trước
          </button>
        </div>
      </div>
    </div>
  );
}
