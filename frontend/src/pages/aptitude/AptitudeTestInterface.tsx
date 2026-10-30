import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { aptitudeApi } from '../../services/api';
import { AptitudeQuestion, AptitudeAttempt } from '../../types';
import {
  Timer,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

export const AptitudeTestInterface: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category') || 'quantitative';
  const difficulty = searchParams.get('difficulty') || 'medium';

  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AptitudeAttempt | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await aptitudeApi.getQuestions(category, difficulty, 10);
        setQuestions(data);
      } catch (err) {
        console.error('Failed to load questions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [category, difficulty]);

  // Countdown timer
  useEffect(() => {
    if (result || loading || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [result, loading, timeLeft]);

  const handleSelectOption = (optIndex: number) => {
    if (result) return; // in review mode
    const currentQ = questions[currentIndex];
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optIndex,
    });
  };

  const clearSelection = () => {
    const currentQ = questions[currentIndex];
    const updated = { ...selectedAnswers };
    delete updated[currentQ.id];
    setSelectedAnswers(updated);
  };

  const handleSubmitTest = async () => {
    if (submitting || result) return;
    setSubmitting(true);
    const timeTaken = 600 - timeLeft;

    try {
      const attempt = await aptitudeApi.submitTest(category, difficulty, timeTaken, selectedAnswers);
      setResult(attempt);
    } catch (err) {
      console.error('Test submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border p-8">
        <p className="text-sm text-slate-600 mb-4">No questions available for the selected criteria.</p>
        <Link to="/aptitude" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
          Return to Aptitude Menu
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedOpt = selectedAnswers[currentQ.id];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Test Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 px-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/aptitude" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-slate-900 capitalize">
              {category} Aptitude Test ({difficulty})
            </h1>
            <p className="text-[11px] text-slate-500">
              Question {currentIndex + 1} of {questions.length} • {Object.keys(selectedAnswers).length} answered
            </p>
          </div>
        </div>

        {!result ? (
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${
              timeLeft < 120 ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-800'
            }`}>
              <Timer className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={handleSubmitTest}
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Scoring...' : 'Submit Test'}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold text-slate-600">
              Score: <strong className="text-indigo-600 text-sm">{result.score_percentage}%</strong> ({result.correct_count}/{result.total_questions})
            </div>
            <Link
              to="/aptitude"
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Aptitude
            </Link>
          </div>
        )}
      </div>

      {/* Main Test Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question & Options Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Topic: {currentQ.topic}
              </span>
              <span className="text-xs text-slate-400 capitalize">{currentQ.difficulty} level</span>
            </div>

            {/* Question Text */}
            <div className="text-sm md:text-base font-semibold text-slate-900 leading-relaxed">
              {currentQ.question_text}
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOpt === idx;
                
                // Review styling if submitted
                let optStyle = 'border-slate-200 hover:border-slate-300 bg-white';
                if (isSelected) {
                  optStyle = 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-1 ring-indigo-600';
                }

                if (result) {
                  const reviewItem = result.detailed_review.find((r) => r.question_id === currentQ.id);
                  if (reviewItem) {
                    if (reviewItem.correct_option === idx) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500';
                    } else if (isSelected && !reviewItem.is_correct) {
                      optStyle = 'border-rose-500 bg-rose-50 text-rose-900 ring-1 ring-rose-500';
                    }
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs md:text-sm transition-all flex items-start gap-3.5 ${optStyle}`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="leading-relaxed flex-1">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation & Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {!result && selectedOpt !== undefined && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs text-slate-500 hover:text-rose-600"
                >
                  Clear Selection
                </button>
              )}

              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIndex === questions.length - 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Explanation Box (Visible in Review Mode) */}
          {result && (
            <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                <BookOpen className="w-4 h-4" />
                <span>Step-by-Step Explanation & Formulation</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {result.detailed_review.find((r) => r.question_id === currentQ.id)?.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Question Palette Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 h-fit">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Question Palette</h3>
          
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = currentIndex === idx;

              let btnColor = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
              if (isAnswered) {
                btnColor = 'bg-indigo-600 text-white';
              }
              if (result) {
                const item = result.detailed_review.find((r) => r.question_id === q.id);
                if (item?.is_correct) {
                  btnColor = 'bg-emerald-600 text-white';
                } else if (isAnswered && !item?.is_correct) {
                  btnColor = 'bg-rose-500 text-white';
                }
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${btnColor} ${
                    isCurrent ? 'ring-2 ring-slate-900 ring-offset-1' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-indigo-600" />
              <span>Answered ({Object.keys(selectedAnswers).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-slate-100 border border-slate-300" />
              <span>Unanswered ({questions.length - Object.keys(selectedAnswers).length})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
