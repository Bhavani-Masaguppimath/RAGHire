import React, { useState, useEffect } from 'react';
import { aptitudeApi, codingApi, interviewApi } from '../../services/api';
import {
  History,
  Brain,
  Code2,
  Mic,
  Users,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface HistoryItem {
  id: string;
  type: string;
  title: string;
  score: string;
  status: string;
  timestamp: string;
}

export const SessionHistory: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [apt, code, intv] = await Promise.all([
          aptitudeApi.getHistory(),
          codingApi.getSubmissions(),
          interviewApi.getHistory()
        ]);

        const unified: HistoryItem[] = [];

        apt.forEach((a) => {
          unified.push({
            id: a.id,
            type: 'Aptitude Test',
            title: `${a.category.toUpperCase()} Aptitude (${a.difficulty})`,
            score: `${a.score_percentage}%`,
            status: a.score_percentage >= 70 ? 'PASS' : 'RETRY',
            timestamp: a.created_at,
          });
        });

        code.forEach((c) => {
          unified.push({
            id: c.id,
            type: 'Coding Assessment',
            title: `Solution submitted in ${c.language.toUpperCase()}`,
            score: `${c.test_cases_passed}/${c.total_test_cases} Passed`,
            status: c.status,
            timestamp: c.created_at,
          });
        });

        intv.forEach((i: any) => {
          unified.push({
            id: i.id,
            type: i.session_type === 'hr' ? 'HR Behavioral' : 'Technical Viva',
            title: `${i.target_role}`,
            score: `${i.overall_score}/10`,
            status: i.status === 'completed' ? 'COMPLETED' : 'IN_PROGRESS',
            timestamp: i.created_at,
          });
        });

        unified.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setItems(unified);
      } catch (err) {
        console.error('Failed to load session history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getTypeIcon = (type: string) => {
    if (type.includes('Aptitude')) return Brain;
    if (type.includes('Coding')) return Code2;
    if (type.includes('HR')) return Users;
    return Mic;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Session Activity History</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Chronological record of all practice tests, code submissions, and mock interviews completed on RAGHire.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        {items.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500">
            No activities recorded yet. Complete practice sessions to populate your activity trail!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const Icon = getTypeIcon(item.type);
              return (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="font-semibold text-slate-600">{item.type}</span>
                        <span>•</span>
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-slate-800">{item.score}</div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === 'PASS' || item.status === 'ACCEPTED' || item.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
