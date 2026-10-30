import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aptitudeApi } from '../../services/api';
import { AptitudeAttempt } from '../../types';
import {
  Brain,
  Timer,
  Award,
  ChevronRight,
  Calculator,
  Compass,
  BookMarked,
  LineChart,
  History,
  CheckCircle2
} from 'lucide-react';

export const AptitudePractice: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<AptitudeAttempt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('quantitative');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, history] = await Promise.all([
          aptitudeApi.getCategories(),
          aptitudeApi.getHistory()
        ]);
        setCategories(cats);
        setAttempts(history);
      } catch (err) {
        console.error('Failed to load aptitude categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartTest = () => {
    navigate(`/aptitude/test?category=${selectedCategory}&difficulty=${selectedDifficulty}`);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'quantitative': return Calculator;
      case 'logical': return Compass;
      case 'verbal': return BookMarked;
      default: return LineChart;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Aptitude Preparation & Mock Tests</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Practice quantitative, logical, verbal, and analytical reasoning questions modeled after campus screening tests.
        </p>
      </div>

      {/* Start Test Configuration Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-sm border border-slate-800">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-400/20">
            <Timer className="w-3.5 h-3.5" />
            <span>Timed Placement Screening Simulator</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Configure Practice Test</h2>
          <p className="text-slate-300 text-xs leading-relaxed mb-6">
            Timed tests evaluate both calculation speed and accuracy. Select category and difficulty to begin.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Select Domain</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="quantitative">Quantitative Aptitude (Math, Work, Time)</option>
                <option value="logical">Logical Reasoning (Syllogisms, Series)</option>
                <option value="verbal">Verbal Ability (Comprehension, Grammar)</option>
                <option value="analytical">Analytical Reasoning (Data Sufficiency)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Difficulty Level</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="easy">Easy (Fundamentals & Direct Formulations)</option>
                <option value="medium">Medium (Standard Campus Drive Level)</option>
                <option value="hard">Hard (Multi-step Complex Word Problems)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStartTest}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            <Brain className="w-4 h-4" />
            <span>Launch Timed Test</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((c) => {
          const Icon = getCategoryIcon(c.category);
          return (
            <div key={c.category} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{c.question_count} Questions</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{c.display_name}</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  {c.topics.slice(0, 3).map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory(c.category);
                  handleStartTest();
                }}
                className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Practice this category</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Past Attempts History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-800">Recent Attempt History</h3>
          </div>
          <span className="text-xs text-slate-500">{attempts.length} attempts recorded</span>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No aptitude attempts recorded yet. Launch your first test above to establish baseline metrics!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {attempts.slice(0, 5).map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 capitalize">{a.category} Aptitude</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {a.difficulty}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Completed in {a.time_taken_seconds}s • {a.correct_count}/{a.total_questions} correct
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`text-sm font-bold ${a.score_percentage >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {a.score_percentage}%
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    a.score_percentage >= 70 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {a.score_percentage >= 70 ? 'PASS' : 'RETRY'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
