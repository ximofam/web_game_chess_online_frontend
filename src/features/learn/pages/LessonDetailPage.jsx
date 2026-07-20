import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Chess } from 'chess.js';
import { getLessonById } from '../data/lessons';
import LessonBoard from '../components/LessonBoard';
import StepControls from '../components/StepControls';
import { LessonValidator } from '../engine/lesson/LessonValidator';
import { ProgressTracker } from '../engine/lesson/ProgressTracker';
import { ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const LessonDetailPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const lesson = useMemo(() => getLessonById(lessonId), [lessonId]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  const [lastMove, setLastMove] = useState(null);

  const currentStep = lesson?.steps[currentStepIndex];

  // Derive initial chess instance based on current step and reset trigger
  const { chessInstance, boardFen } = useMemo(() => {
    if (!currentStep) return { chessInstance: null, boardFen: '' };
    const instance = new Chess(currentStep.fen);
    return { chessInstance: instance, boardFen: instance.fen() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, resetCount]);

  const [currentFen, setCurrentFen] = useState('');
  const activeFen = currentFen || boardFen;

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex flex-col items-center justify-center p-6 text-center text-slate-100">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Lesson Not Found</h2>
        <p className="text-slate-400 mb-6">The requested lesson standard does not exist or has been moved.</p>
        <Link
          to="/learn"
          className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors"
        >
          Back to Lessons
        </Link>
      </div>
    );
  }

  const handleMove = (moveCandidate) => {
    if (!chessInstance || isStepCompleted) return false;

    const result = LessonValidator.validateMove(chessInstance, moveCandidate, currentStep);

    if (result.success && result.move) {
      chessInstance.move(result.move);
      setCurrentFen(chessInstance.fen());
      setLastMove({ from: result.move.from, to: result.move.to });
      setIsStepCompleted(true);
      setFeedback({ type: 'success', text: currentStep.successMessage || 'Great move!' });

      ProgressTracker.saveStepProgress(lesson.id, currentStepIndex);

      if (currentStepIndex + 1 >= lesson.steps.length) {
        ProgressTracker.markLessonComplete(lesson.id);
      }
      return true;
    } else {
      setFeedback({ type: 'error', text: result.error || 'Wrong move! Try again.' });
      return false;
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex + 1 < lesson.steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setCurrentFen('');
      setShowHint(false);
      setFeedback(null);
      setIsStepCompleted(false);
      setLastMove(null);
    } else {
      navigate('/learn');
    }
  };

  const handleRestartStep = () => {
    setResetCount((prev) => prev + 1);
    setCurrentFen('');
    setShowHint(false);
    setFeedback(null);
    setIsStepCompleted(false);
    setLastMove(null);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back link & Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Lessons
          </Link>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            {lesson.category}
          </span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Chessboard Column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <LessonBoard
              fen={activeFen}
              orientation={currentStep?.orientation || 'white'}
              onMove={handleMove}
              highlightSquares={showHint ? currentStep?.hint?.highlightSquares : []}
              arrows={showHint ? currentStep?.hint?.arrows : []}
              lastMove={lastMove}
              arePiecesDraggable={!isStepCompleted}
            />
          </div>

          {/* Right: Step Description & Controls Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-4">
                <h3 className="text-base font-semibold text-amber-400">{currentStep?.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{currentStep?.description}</p>
              </div>

              {/* Feedback Alert Toast */}
              {feedback && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 transition-all animate-fade-in ${
                    feedback.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs sm:text-sm font-medium">{feedback.text}</span>
                </div>
              )}

              {/* Hint Box */}
              {showHint && currentStep?.hint?.text && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm leading-relaxed animate-fade-in">
                  💡 <strong>Hint:</strong> {currentStep.hint.text}
                </div>
              )}
            </div>

            {/* Step Navigation Controls */}
            <StepControls
              currentStepIndex={currentStepIndex}
              totalSteps={lesson.steps.length}
              isStepCompleted={isStepCompleted}
              showHint={showHint}
              onToggleHint={() => setShowHint((prev) => !prev)}
              onRestartStep={handleRestartStep}
              onNextStep={handleNextStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;
