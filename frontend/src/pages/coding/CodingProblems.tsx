import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { codingApi } from '../../services/api';
import { CodingProblem } from '../../types';
import { Code2, ArrowRight, CheckCircle2, Filter, Terminal } from 'lucide-react';

export const CodingProblems: React.FC = () => {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await codingApi.getProblems(difficultyFilter || undefined, topicFilter || undefined);
        setProblems(data);
      } catch (err) {
        console.error('Failed to load coding problems:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [difficultyFilter, topicFilter]);

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'hard':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
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
        <h1 className="text-xl font-bold text-slate-900">Coding Practice & Technical Sandbox</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Solve data structure and algorithmic challenges in Python or Java with isolated test-case execution.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none"
          >
            <option value="">All Topics</option>
            <option value="Arrays">Arrays & Hash Maps</option>
            <option value="Sliding Window">Sliding Window</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing {problems.length} Placement Challenges
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-3">
        {problems.map((p) => (
          <div
            key={p.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-indigo-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${getDifficultyBadge(p.difficulty)}`}>
                  {p.difficulty}
                </span>
                <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {p.topic}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl">{p.description}</p>
            </div>

            <Link
              to={`/coding/${p.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-all flex-shrink-0"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Solve Challenge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
