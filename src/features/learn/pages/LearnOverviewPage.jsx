import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ALL_LESSONS } from '../data/lessons';
import LessonCard from '../components/LessonCard';
import { ProgressTracker } from '../engine/lesson/ProgressTracker';
import { BookOpen, Trophy, Bot, Sparkles, RotateCcw } from 'lucide-react';

const LearnOverviewPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['learn']);
  const [completedMap, setCompletedMap] = useState(() => ProgressTracker.getProgress().completedLessons || {});

  const handleResetProgress = () => {
    if (window.confirm(t('learn:confirm_reset_progress'))) {
      ProgressTracker.resetProgress();
      setCompletedMap({});
    }
  };

  const completedCount = Object.keys(completedMap).length;
  const totalCount = ALL_LESSONS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Group lessons by category
  const categories = Array.from(new Set(ALL_LESSONS.map((l) => l.category)));

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header / Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" /> {t('learn:interactive_chess_academy')}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {t('learn:learn_and_master')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{t('learn:chess')}</span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                {t('learn:learn_overview_desc')}
              </p>
            </div>

            {/* Quick Stats Card */}
            <div className="w-full md:w-auto min-w-[280px] bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('learn:total_progress')}</span>
                <span className="text-xs font-extrabold text-amber-400">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Trophy className="w-4 h-4 text-amber-400" /> {t('learn:n_of_m_completed', { completed: completedCount, total: totalCount })}
                </span>
                {completedCount > 0 && (
                  <button
                    onClick={handleResetProgress}
                    className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title={t('learn:reset_progress_title')}
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> {t('learn:reset')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Play vs Computer Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{t('learn:play_against_ai')}</h2>
              <p className="text-sm text-slate-400">{t('learn:play_against_ai_desc')}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/learn/play-bot')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            {t('learn:start_practice_game')}
          </button>
        </div>

        {/* Lessons List by Category */}
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryLessons = ALL_LESSONS.filter((l) => l.category === category);
            return (
              <div key={category} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-100">{t(`learn:category_${category.replace(/[^a-zA-Z]/g, '').toLowerCase()}`, category)}</h2>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-800 px-2.5 py-0.5 rounded-full">
                    {t('learn:n_lessons', { count: categoryLessons.length })}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryLessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      isCompleted={Boolean(completedMap[lesson.id])}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearnOverviewPage;
