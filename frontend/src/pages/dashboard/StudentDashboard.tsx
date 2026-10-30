import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsApi } from '../../services/api';
import { DashboardMetrics } from '../../types';
import {
  Brain,
  Code2,
  Mic,
  ShieldAlert,
  SearchCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await analyticsApi.getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to fetch dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const radarData = metrics ? [
    { subject: 'Aptitude', value: metrics.aptitude_accuracy },
    { subject: 'Coding', value: metrics.coding_pass_rate },
    { subject: 'Technical', value: metrics.technical_interview_score * 10 },
    { subject: 'HR Comms', value: metrics.hr_communication_score * 10 },
    { subject: 'Project Defense', value: metrics.project_defense_score * 10 },
    { subject: 'Evidence Trail', value: metrics.evidence_consistency_score },
  ] : [];

  const trendData = [
    { week: 'Week 1', score: 62 },
    { week: 'Week 2', score: 68 },
    { week: 'Week 3', score: 74 },
    { week: 'Week 4', score: 79 },
    { week: 'Current', score: metrics?.placement_readiness_score || 84 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-sm border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-400/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target Role: {user?.profile?.target_job_role || 'Full Stack Software Engineer'}</span>
            <span className="text-indigo-400/50">•</span>
            <span className="text-slate-300 font-normal">
              {user?.profile?.degree ? user.profile.degree : 'Candidate (All Streams)'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name || 'Candidate'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed">
            Your Placement Readiness Index is dynamically aggregated across aptitude, coding, viva rounds, and cross-round evidence traceability.
          </p>
        </div>

        {/* Readiness Score Card */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-400"
                strokeDasharray={`${metrics?.placement_readiness_score || 80}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-bold text-sm text-white">
              {metrics?.placement_readiness_score || 84}%
            </span>
          </div>
          <div>
            <div className="text-xs text-indigo-300 font-medium">Placement Status</div>
            <div className="text-base font-bold text-white">
              {metrics && metrics.placement_readiness_score >= 75 ? 'Placement Ready' : 'Needs Practice'}
            </div>
            <div className="text-[11px] text-slate-400">Top 15% in cohort</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Aptitude Accuracy', val: `${metrics?.aptitude_accuracy || 0}%`, icon: Brain, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Coding Pass Rate', val: `${metrics?.coding_pass_rate || 0}%`, icon: Code2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Tech Viva Rating', val: `${metrics?.technical_interview_score || 0}/10`, icon: Mic, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'HR Communication', val: `${metrics?.hr_communication_score || 0}/10`, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Project Defense', val: `${metrics?.project_defense_score || 0}/10`, icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Evidence Health', val: `${metrics?.evidence_consistency_score || 0}%`, icon: SearchCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{item.label}</span>
                <div className={`p-1.5 rounded-lg ${item.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
              </div>
              <div className="text-xl font-bold text-slate-900">{item.val}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-Round Competency Radar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Multi-Round Competency Profile</h2>
              <p className="text-xs text-slate-500">Candidate balance across all 6 campus screening dimensions</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
              Target: 75%
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Candidate" dataKey="value" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readiness Progress Area Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Placement Readiness Trend</h2>
              <p className="text-xs text-slate-500">Overall score progression over recent practice sessions</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+22% Growth</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strong & Weak Topics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Topics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">Demonstrated Strengths</h3>
          </div>
          <div className="space-y-2">
            {metrics?.strong_topics.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs">
                <span className="font-medium text-emerald-900">{t}</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">High Mastery</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-800">Priority Improvement Areas</h3>
          </div>
          <div className="space-y-2">
            {metrics?.weak_topics.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 text-xs">
                <span className="font-medium text-amber-900">{t}</span>
                <Link to="/learning-plan" className="text-[10px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                  <span>Practice Remedy</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Action Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Start Next Practice Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/aptitude"
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">Aptitude Test</div>
              <p className="text-xs text-slate-500 mt-0.5">Timed Quantitative & Logical practice</p>
            </div>
          </Link>

          <Link
            to="/coding"
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">Coding Practice</div>
              <p className="text-xs text-slate-500 mt-0.5">Solve DSA challenges in Monaco</p>
            </div>
          </Link>

          <Link
            to="/interview/technical"
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">Mock Interview</div>
              <p className="text-xs text-slate-500 mt-0.5">Voice or text viva with AI rubrics</p>
            </div>
          </Link>

          <Link
            to="/evidence"
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <SearchCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">Evidence Audit</div>
              <p className="text-xs text-slate-500 mt-0.5">Review follow-ups & claims</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
