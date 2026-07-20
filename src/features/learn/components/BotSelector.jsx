import { Bot, Sparkles, ShieldAlert } from 'lucide-react';

const BotSelector = ({
  selectedStrategy,
  onSelectStrategy,
  difficulty,
  onSelectDifficulty,
  playerColor,
  onSelectColor,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-5 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100">Bot Strategy & Difficulty</h3>
          <p className="text-xs text-slate-400">Configure your AI opponent on the frontend</p>
        </div>
      </div>

      {/* Strategy Selection */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          AI Engine Strategy
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSelectStrategy('random')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
              selectedStrategy === 'random'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Random Strategy
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSelectStrategy('minimax')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
              selectedStrategy === 'minimax'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> MiniMax Strategy
          </button>
        </div>
      </div>

      {/* Difficulty Level */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Difficulty Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { lvl: 1, label: 'Easy' },
            { lvl: 2, label: 'Medium' },
            { lvl: 3, label: 'Hard' },
          ].map(({ lvl, label }) => (
            <button
              key={lvl}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDifficulty(lvl)}
              className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                difficulty === lvl
                  ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-md'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Side selection */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Play As
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSelectColor('white')}
            className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
              playerColor === 'white'
                ? 'bg-slate-100 text-slate-900 border-slate-100 font-bold'
                : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            ⚪ White (Moves 1st)
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSelectColor('black')}
            className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
              playerColor === 'black'
                ? 'bg-slate-950 text-slate-100 border-slate-700 font-bold'
                : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            ⚫ Black (Moves 2nd)
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotSelector;
