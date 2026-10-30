import React, { useState } from 'react';
import { interviewApi } from '../../services/api';
import { InterviewSession, InterviewEvaluation } from '../../types';
import { VoiceRecorder } from '../../components/speech/VoiceRecorder';
import {
  Users,
  Mic,
  Send,
  CheckCircle2,
  Award,
  Sparkles,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

export const HRCommunication: React.FC = () => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const handleStartSession = async () => {
    setIsStarting(true);
    try {
      const data = await interviewApi.startSession('hr', [], 'Full Stack Software Engineer', 3);
      setSession(data);
      setCurrentQIndex(0);
      setStudentAnswer('');
      setEvaluation(null);
      setSessionCompleted(false);
    } catch (err) {
      console.error('Failed to start HR interview:', err);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !studentAnswer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const currentQ = session.questions[currentQIndex];

    try {
      const evalRes = await interviewApi.submitAnswer(currentQ.id, studentAnswer, 'voice');
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
      setSessionCompleted(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">HR & Behavioral Communication Practice</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Practice situational, behavioral, and leadership questions evaluated using the STAR (Situation, Task, Action, Result) methodology.
        </p>
      </div>

      {!session || sessionCompleted ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
          {sessionCompleted && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <strong>HR Session Complete!</strong> Your communication feedback and behavioral scores have been updated.
              </div>
            </div>
          )}

          <div>
            <h2 className="text-base font-bold text-slate-900">Start HR Practice Session</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Questions focus on self-introduction, conflict resolution, technical disagreements, and career vision. Use the microphone or text input.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
            <strong className="text-slate-900 block font-semibold">The STAR Method Guidelines:</strong>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li><strong>S (Situation):</strong> Briefly describe the context or challenge faced.</li>
              <li><strong>T (Task):</strong> Explain what goal or deliverable was required of you.</li>
              <li><strong>A (Action):</strong> Specify the exact actions you took to address the problem.</li>
              <li><strong>R (Result):</strong> Highlight the quantifiable outcome and lessons learned.</li>
            </ul>
          </div>

          <button
            onClick={handleStartSession}
            disabled={isStarting}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all disabled:opacity-50"
          >
            <Users className="w-4 h-4" />
            <span>{isStarting ? 'Preparing questions...' : 'Launch HR Interview'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Question {currentQIndex + 1} of {session.questions.length} • Behavioral Assessment
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                STAR Evaluation Active
              </span>
            </div>

            <h2 className="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
              {session.questions[currentQIndex]?.question_text}
            </h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">Your Spoken or Written Response:</label>
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
                placeholder="Structure your answer using Situation, Task, Action, and Result..."
                className="w-full p-4 border border-slate-300 rounded-xl text-xs md:text-sm focus:outline-none focus:border-indigo-500 leading-relaxed disabled:bg-slate-50 disabled:text-slate-700"
              />
            </div>

            {!evaluation && (
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
            )}
          </div>

          {evaluation && (
            <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Communication & Structure Feedback</h3>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                  <Award className="w-3.5 h-3.5" />
                  <span>Score: {evaluation.score}/10</span>
                </div>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <strong className="text-indigo-900 block mb-1">Evaluator Guidance:</strong>
                {evaluation.ai_feedback}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
                >
                  <span>{currentQIndex < session.questions.length - 1 ? 'Next Question' : 'Complete HR Session'}</span>
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
