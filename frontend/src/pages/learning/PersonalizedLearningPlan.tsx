import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationApi } from '../../services/api';
import { LearningRecommendation } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Brain,
  Code2,
  Mic,
  ShieldCheck,
  Check
} from 'lucide-react';

export const PersonalizedLearningPlan: React.FC = () => {
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const data = await recommendationApi.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await recommendationApi.refreshRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to refresh recommendations:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleComplete = async (rec: LearningRecommendation) => {
    try {
      const updated = await recommendationApi.toggleRecommendation(rec.id, !rec.is_completed);
      setRecommendations(recommendations.map((r) => (r.id === rec.id ? updated : r)));
    } catch (err) {
      console.error('Failed to toggle recommendation:', err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'aptitude': return Brain;
      case 'coding': return Code2;
      case 'technical': return Mic;
      case 'project defense': return ShieldCheck;
      default: return BookOpen;
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p.toLowerCase()) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
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

  const completedCount = recommendations.filter((r) => r.is_completed).length;
  const progressPercent = recommendations.length === 0 ? 0 : Math.round((completedCount / recommendations.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Personalized Learning Roadmap</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Targeted preparation actions dynamically synthesized from your test attempts and interview rubrics.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Synthesizing...' : 'Re-calculate Roadmap'}</span>
        </button>
      </div>

      {/* Progress Meter Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-slate-800">Preparation Action Progress</div>
          <p className="text-xs text-slate-500 mt-0.5">
            {completedCount} of {recommendations.length} recommended activities marked as completed.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Roadmap Completion</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border p-8 text-xs text-slate-500">
            No recommendations generated yet. Complete aptitude, coding, or interview practice to build your roadmap!
          </div>
        ) : (
          recommendations.map((rec) => {
            const Icon = getCategoryIcon(rec.category);
            return (
              <div
                key={rec.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  rec.is_completed ? 'border-slate-200 opacity-60 bg-slate-50/50' : 'border-slate-200/80 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleComplete(rec)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      rec.is_completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-indigo-500 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${getPriorityBadge(rec.priority)}`}>
                        {rec.priority} Priority
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {rec.category}
                      </span>
                    </div>

                    <h3 className={`text-sm font-bold text-slate-900 ${rec.is_completed ? 'line-through text-slate-500' : ''}`}>
                      {rec.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{rec.suggested_action}</p>

                    <div className="text-[11px] text-slate-500 italic pt-1">
                      <strong>Why this is recommended:</strong> {rec.reason}
                    </div>
                  </div>
                </div>

                {rec.resource_link && !rec.is_completed && (
                  <Link
                    to={rec.resource_link}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-all border border-indigo-100"
                  >
                    <span>Start Activity</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
