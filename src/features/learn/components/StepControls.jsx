import { RotateCcw, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const StepControls = ({
  currentStepIndex,
  totalSteps,
  isStepCompleted,
  showHint,
  onToggleHint,
  onRestartStep,
  onNextStep,
}) => {
  return (
    <div className="flex flex-col gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Step {currentStepIndex + 1} of {totalSteps}
        </span>
        {isStepCompleted && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        )}
      </div>

      {/* Progress indicators */}
      <div className="grid grid-cols-12 gap-1.5 w-full">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentStepIndex
                ? 'bg-amber-400 shadow-sm shadow-amber-500/50'
                : idx < currentStepIndex
                ? 'bg-emerald-500'
                : 'bg-slate-700/60'
            }`}
            style={{ gridColumn: `span ${Math.floor(12 / totalSteps)}` }}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={onRestartStep}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
        >
          <RotateCcw className="w-4 h-4" /> Restart
        </button>

        <button
          onClick={onToggleHint}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-colors border ${
            showHint
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>

        {isStepCompleted && (
          <button
            onClick={onNextStep}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-lg shadow-amber-400/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {currentStepIndex + 1 >= totalSteps ? 'Finish Lesson' : 'Next Step'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default StepControls;
