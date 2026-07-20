import { useNavigate } from 'react-router-dom';
import { Shield, Compass, Zap, Target, AlertTriangle, Crown, ShieldAlert, Flame, CheckCircle2, ChevronRight, Clock } from 'lucide-react';

const ICON_MAP = {
  Shield,
  Compass,
  Zap,
  Target,
  AlertTriangle,
  Crown,
  ShieldAlert,
  Flame,
};

const LessonCard = ({ lesson, isCompleted }) => {
  const navigate = useNavigate();
  const IconComponent = ICON_MAP[lesson.icon] || Shield;

  const difficultyColors = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Advanced: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div
      onClick={() => navigate(`/learn/${lesson.id}`)}
      className="group relative flex flex-col justify-between p-6 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform duration-300">
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Done
            </span>
          )}
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${difficultyColors[lesson.difficulty] || difficultyColors.Beginner}`}>
            {lesson.difficulty}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors mb-1.5">
          {lesson.title}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-2 mb-4">
          {lesson.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" /> {lesson.estimatedTime}
        </span>
        <span className="flex items-center gap-1 text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
          Start <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};

export default LessonCard;
