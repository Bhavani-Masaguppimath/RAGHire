import React, { useState } from 'react';
import { interviewApi } from '../../services/api';
import { InterviewSession, InterviewEvaluation } from '../../types';
import { VoiceRecorder } from '../../components/speech/VoiceRecorder';
import {
  Mic,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  SearchCheck,
  ChevronRight
} from 'lucide-react';

export const TechnicalInterview: React.FC = () => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Setup modal state
  const [subjects, setSubjects] = useState<string[]>(['DSA', 'DBMS', 'Operating Systems']);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(3);
  const [isStarting, setIsStarting] = useState(false);

  const toggleSubject = (s: string) => {
    if (subjects.includes(s)) {
      if (subjects.length > 1) setSubjects(subjects.filter((sub) => sub !== s));
    } else {
      setSubjects([...subjects, s]);
    }
  };

  const handleStartSession = async () => {
    setIsStarting(true);
    try {
      const data = await interviewApi.startSession('technical', subjects, 'Full Stack Software Engineer', questionCount);
      setSession(data);
      setCurrentQIndex(0);
      setStudentAnswer('');
      setEvaluation(null);
      setSessionCompleted(false);
    } catch (err) {
      console.error('Failed to start interview:', err);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !studentAnswer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const currentQ = session.questions[currentQIndex];

    try {
      const evalRes = await interviewApi.submitAnswer(currentQ.id, studentAnswer, 'text');
      setEvaluation(evalRes);
    } catch (err) {
      console.error('Failed to submit answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;
    if (currentQIndex < session.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setStudentAnswer('');
      setEvaluation(null);
    } else {
      handleCompleteSession();
    }
  };

  const handleCompleteSession = async () => {
    if (!session) return;
    try {
      await interviewApi.completeSession(session.id);
      setSessionCompleted(true);
    } catch (err) {
      console.error('Failed to complete session:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Technical Interview Practice</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Simulate one-on-one technical screening viva with AI multi-rubric evaluation and speech-to-text recording.
        </p>
      </div>

      {/* Start / Configure Interview Card if no active session */}
      {!session || sessionCompleted ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
          {sessionCompleted && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <strong>Interview Session Complete!</strong> Your answers and evaluations have been compiled into your performance reports.
              </div>
            </div>
          )}

          <div>
            <h2 className="text-base font-bold text-slate-900">Configure New Technical Interview</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select technical subjects and question depth for your practice round.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Core Technical Subjects
              </label>
              <div className="flex flex-wrap gap-2">
                {['DSA', 'DBMS', 'Operating Systems', 'Computer Networks', 'OOP & System Design'].map((s) => {
                  const isChecked = subjects.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSubject(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isChecked
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                >
                  <option value="easy">Easy (Definitions & Syntax)</option>
                  <option value="medium">Medium (Standard Campus Technical Round)</option>
                  <option value="hard">Hard (Internal Mechanisms & Concurrency)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Number of Questions
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value) || 3)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                >
                  <option value={3}>3 Questions (Quick Practice - ~10 mins)</option>
                  <option value={5}>5 Questions (Standard Mock - ~20 mins)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartSession}
              disabled={isStarting}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all disabled:opacity-50"
            >
              <Mic className="w-4 h-4" />
              <span>{isStarting ? 'Setting up...' : 'Start Technical Session'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Interactive Question-by-Question Interview Interface */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Question {currentQIndex + 1} of {session.questions.length} • {session.questions[currentQIndex]?.category}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Interactive Viva Mode
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
              {session.questions[currentQIndex]?.question_text}
            </h2>

            {/* Student Answer Input Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">Your Technical Response:</label>
                <VoiceRecorder
                  onTranscriptChange={(text) => setStudentAnswer((prev) => (prev ? `${prev} ${text}` : text))}
                  isProcessing={isSubmitting || !!evaluation}
                />
              </div>

              <textarea
                rows={6}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                disabled={!!evaluation || isSubmitting}
                placeholder="Structure your answer clearly: mention definition, time/space complexity, practical trade-offs, and failure cases..."
                className="w-full p-4 border border-slate-300 rounded-xl text-xs md:text-sm focus:outline-none focus:border-indigo-500 leading-relaxed disabled:bg-slate-50 disabled:text-slate-700"
              />
            </div>

            {!evaluation ? (
              <div className="flex justify-end">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!studentAnswer.trim() || isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Evaluating Response...' : 'Submit Response'}</span>
                </button>
              </div>
            ) : null}
          </div>

          {/* AI Rubric Evaluation Card */}
          {evaluation && (
            <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">AI Placement Evaluator Feedback</h3>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                  <Award className="w-3.5 h-3.5" />
                  <span>Overall Score: {evaluation.score}/10</span>
                </div>
              </div>

              {/* Rubric Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Technical Correctness', val: `${evaluation.correctness}/10` },
                  { label: 'Completeness', val: `${evaluation.completeness}/10` },
                  { label: 'Clarity & Structure', val: `${evaluation.clarity}/10` },
                  { label: 'Relevance', val: `${evaluation.relevance}/10` },
                ].map((r, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase">{r.label}</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">{r.val}</div>
                  </div>
                ))}
              </div>

              {/* Constructive Feedback */}
              <div className="text-xs text-slate-700 leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <strong className="text-indigo-900 block mb-1">Evaluator Comments:</strong>
                {evaluation.ai_feedback}
              </div>

              {/* Expected Model Answer Guide */}
              <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                <strong className="text-slate-800 block mb-1">Model Answer Concept Guide:</strong>
                {evaluation.expected_answer_guide}
              </div>

              {/* Cross-Round Evidence Notification */}
              {evaluation.cross_round_claim_identified && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                  <SearchCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <strong className="font-semibold">Cross-Round Evidence Tracked:</strong> Claim recorded and cross-referenced with your project architecture docs.
                  </div>
                </div>
              )}

              {/* Next Question Control */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
                >
                  <span>{currentQIndex < session.questions.length - 1 ? 'Next Question' : 'Complete Interview'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
