import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { CandidateCohortItem, CampusDriveItem, StreamAnalyticsItem } from '../../types';
import {
  LayoutDashboard,
  Users,
  Brain,
  Code2,
  FileText,
  Briefcase,
  ShieldCheck,
  SearchCheck,
  BarChart3,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Plus,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  Filter,
  Download,
  Calendar,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Award,
  Eye,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

interface AdminDashboardProps {
  defaultTab?: 'overview' | 'candidates' | 'analytics' | 'drives' | 'evidence';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ defaultTab = 'overview' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on prop or URL path
  const getInitialTab = (): 'overview' | 'candidates' | 'analytics' | 'drives' | 'evidence' => {
    if (location.pathname === '/admin/candidates') return 'candidates';
    if (location.pathname === '/admin/analytics') return 'analytics';
    if (location.pathname === '/admin/drives') return 'drives';
    if (location.pathname === '/admin/evidence') return 'evidence';
    return defaultTab;
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'analytics' | 'drives' | 'evidence'>(getInitialTab);
  const [stats, setStats] = useState<any | null>(null);
  const [candidates, setCandidates] = useState<CandidateCohortItem[]>([]);
  const [streamAnalytics, setStreamAnalytics] = useState<StreamAnalyticsItem[]>([]);
  const [drives, setDrives] = useState<CampusDriveItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters for candidates tab
  const [searchQuery, setSearchQuery] = useState('');
  const [streamFilter, setStreamFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateCohortItem | null>(null);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPackage, setNewPackage] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newMinScore, setNewMinScore] = useState(70);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);

  const handleTabChange = (tab: 'overview' | 'candidates' | 'analytics' | 'drives' | 'evidence') => {
    setActiveTab(tab);
    if (tab === 'overview') navigate('/admin');
    else navigate(`/admin/${tab}`);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [statsData, candidatesData, streamData, drivesData] = await Promise.all([
          adminApi.getStats(),
          adminApi.getCandidates(),
          adminApi.getStreamAnalytics(),
          adminApi.getCampusDrives(),
        ]);
        setStats(statsData);
        setCandidates(candidatesData);
        setStreamAnalytics(streamData);
        setDrives(drivesData);
      } catch (err) {
        console.error('Failed to load admin portal data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole) return;
    try {
      const created = await adminApi.createCampusDrive({
        company: newCompany,
        role: newRole,
        package_ctc: newPackage || '12.0 LPA',
        eligible_streams: ['All Academic Streams'],
        min_readiness_score: newMinScore,
        drive_date: newDate || '2026-12-20',
      });
      setDrives([...drives, created.drive]);
      setShowDriveModal(false);
      setNewCompany('');
      setNewRole('');
      setNewPackage('');
    } catch (err) {
      console.error('Failed to schedule drive:', err);
    }
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.target_role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStream =
      streamFilter === 'All' || c.stream.toLowerCase().includes(streamFilter.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesStream && matchesStatus;
  });

  const streamChartData = streamAnalytics.map((s) => ({
    name: s.stream.split(' ')[0],
    fullName: s.stream,
    rate: s.placement_ready_rate,
    candidates: s.total_candidates,
  }));

  const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Placement Director Command Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Placement Director & Cell Command Center</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Batch 2026 Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                All Streams Included
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, Dr. Placement Director
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Real-time oversight of institutional recruitment drives, cross-stream candidate readiness benchmarks, question bank curation, and cross-round evidence audits.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-white font-extrabold text-xl shadow-inner">
              {stats?.batch_readiness_rate || 81.4}%
            </div>
            <div>
              <div className="text-[11px] text-indigo-300 uppercase tracking-wider font-semibold">Cohort Readiness</div>
              <div className="text-base font-bold text-white">89 / 128 Candidates</div>
              <div className="text-[11px] text-emerald-400 font-medium">+14% vs Previous Season</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'overview', label: 'Director Overview', icon: LayoutDashboard },
          { id: 'candidates', label: 'Candidate Directory & Cohort', icon: Users, badge: candidates.length },
          { id: 'analytics', label: 'Multi-Stream Analytics', icon: BarChart3 },
          { id: 'drives', label: 'Campus Placement Drives', icon: Briefcase, badge: drives.length },
          { id: 'evidence', label: 'Evidence Audit Inspector', icon: SearchCheck, badge: 'AI Audit' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW COMMAND CENTER */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              { label: 'Enrolled Candidates', val: stats?.total_students || 128, sub: 'Across 5 Streams', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Cohort Readiness Rate', val: `${stats?.batch_readiness_rate || 81.4}%`, sub: 'Placement Ready', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Active Placement Drives', val: drives.length, sub: 'Top Tier Recruiters', icon: Briefcase, color: 'text-sky-600', bg: 'bg-sky-50' },
              { label: 'Audited Evidence Claims', val: stats?.evidence_claims_audited || 284, sub: 'Multi-Round Trail', icon: SearchCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Question Bank Curation', val: `${(stats?.total_aptitude_questions || 0) + (stats?.total_coding_problems || 0)} Items`, sub: 'Aptitude & Coding', icon: Brain, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'RAG Knowledge Vault', val: `${stats?.total_learning_resources || 4} Packs`, sub: 'Institutional Guides', icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</span>
                    <div className={`p-1.5 rounded-lg ${kpi.bg}`}>
                      <Icon className={`w-4 h-4 ${kpi.color}`} />
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-slate-900">{kpi.val}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{kpi.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stream Comparison Bar Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Placement Readiness by Academic Stream</h3>
                  <p className="text-xs text-slate-500">Comparative benchmark across all student disciplines</p>
                </div>
                <button
                  onClick={() => handleTabChange('analytics')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                >
                  <span>Detailed Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={streamChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg">
                              <p className="font-bold">{data.fullName}</p>
                              <p className="text-indigo-300 mt-0.5">Readiness: {data.rate}%</p>
                              <p className="text-slate-400">Total Enrolled: {data.candidates} students</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                      {streamChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 5-Stage Campus Recruitment Funnel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Batch Recruitment Pipeline</h3>
                <p className="text-xs text-slate-500 mb-4">Progression of 128 candidates across rounds</p>

                <div className="space-y-3">
                  {[
                    { stage: '1. Resume Alignment', count: '128 / 128', pct: 100, color: 'bg-indigo-600' },
                    { stage: '2. Aptitude Cleared', count: '112 / 128', pct: 87.5, color: 'bg-sky-500' },
                    { stage: '3. Coding Sandboxed', count: '104 / 128', pct: 81.2, color: 'bg-purple-600' },
                    { stage: '4. Technical & HR Viva', count: '98 / 128', pct: 76.5, color: 'bg-amber-500' },
                    { stage: '5. Placement Ready', count: '89 / 128', pct: 69.5, color: 'bg-emerald-600' },
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{s.stage}</span>
                        <span className="text-slate-500">{s.count} ({s.pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Cohort Status:</span>
                <span className="font-bold text-emerald-600">89 Cleared All 5 Stages</span>
              </div>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/questions"
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Manage Question Bank</h4>
              <p className="text-xs text-slate-500 mt-1">Curate aptitude items and Monaco coding challenges.</p>
            </Link>

            <Link
              to="/admin/resources"
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">RAG Knowledge Vault</h4>
              <p className="text-xs text-slate-500 mt-1">Ingest approved university curricula and cheat sheets.</p>
            </Link>

            <button
              onClick={() => handleTabChange('drives')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-500 hover:shadow-md transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Campus Drives</h4>
              <p className="text-xs text-slate-500 mt-1">Track recruiters, eligibility criteria & job offers.</p>
            </button>

            <button
              onClick={() => handleTabChange('candidates')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-500 hover:shadow-md transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Candidate Directory</h4>
              <p className="text-xs text-slate-500 mt-1">Filter by stream, score, and view verified dossiers.</p>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATE DIRECTORY & COHORT */}
      {activeTab === 'candidates' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Enrolled Candidates Directory</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitor student readiness across all academic streams, inspect scores, and verify evidence.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Total Displayed:</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                {filteredCandidates.length} Candidates
              </span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by candidate name, email, or role..."
                className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <select
                value={streamFilter}
                onChange={(e) => setStreamFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="All">All Academic Streams</option>
                <option value="Computer Science">Computer Science & IT</option>
                <option value="Engineering">Core Engineering (ECE, EEE, Mech)</option>
                <option value="Data Science">Data Science & AI</option>
                <option value="Management">Management & MBA</option>
                <option value="Science">Pure & Applied Sciences</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="All">All Placement Statuses</option>
                <option value="Placement Ready">Placement Ready (75% or higher)</option>
                <option value="In Progress">In Progress (60% - 74%)</option>
                <option value="Needs Practice">Needs Practice (below 60%)</option>
              </select>
            </div>
          </div>

          {/* Candidates Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="p-3.5">Candidate Name</th>
                  <th className="p-3.5">Academic Stream & Degree</th>
                  <th className="p-3.5">Target Role</th>
                  <th className="p-3.5">Readiness Score</th>
                  <th className="p-3.5">Multi-Round Split</th>
                  <th className="p-3.5">Evidence Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                          {c.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{c.full_name}</div>
                          <div className="text-[11px] text-slate-400">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">{c.stream}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{c.degree}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {c.target_role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{c.readiness_score}%</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'Placement Ready'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : c.status === 'In Progress'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-[11px] text-slate-500 space-y-0.5">
                      <div>Apt: <strong className="text-slate-800">{c.aptitude_score}%</strong> • Code: <strong className="text-slate-800">{c.coding_score}%</strong></div>
                      <div>Viva: <strong className="text-slate-800">{c.interview_score}/10</strong></div>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{c.evidence_status}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedCandidate(c)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Dossier</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-STREAM ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streamAnalytics.map((s, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Discipline</span>
                  <span className="text-xs font-bold text-slate-800">{s.total_candidates} Students</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{s.stream}</h4>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Readiness</div>
                    <div className="text-lg font-bold text-emerald-600 mt-0.5">{s.placement_ready_rate}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Avg Coding</div>
                    <div className="text-lg font-bold text-indigo-600 mt-0.5">{s.avg_coding}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Avg Aptitude</div>
                    <div className="text-lg font-bold text-sky-600 mt-0.5">{s.avg_aptitude}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Avg Viva</div>
                    <div className="text-lg font-bold text-purple-600 mt-0.5">{s.avg_interview}/10</div>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Target Hiring Companies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.top_companies.map((c, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CAMPUS RECRUITMENT DRIVES */}
      {activeTab === 'drives' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Campus Recruitment Drives (2026 Season)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Corporate placement schedules, eligibility thresholds, and applicant tracking.
              </p>
            </div>
            <button
              onClick={() => setShowDriveModal(true)}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Drive</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {drives.map((d) => (
              <div key={d.id} className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {d.status}
                    </span>
                    <span className="text-sm font-extrabold text-emerald-600">{d.package_ctc}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{d.company}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{d.role}</p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Drive Date:</span>
                      <strong className="text-slate-800">{d.drive_date}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Min Readiness Threshold:</span>
                      <strong className="text-indigo-600">{d.min_readiness_score}%</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Registered Applicants:</span>
                      <strong className="text-slate-900">{d.applied_count} Candidates</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Eligible Academic Streams:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {d.eligible_streams.map((es, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {es}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EVIDENCE AUDIT INSPECTOR */}
      {activeTab === 'evidence' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200">
              <SearchCheck className="w-3.5 h-3.5" />
              <span>Institutional Evidence Corroboration Engine</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Cross-Round Evidence Audit Overview</h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              Inspect claims extracted from candidate resumes and how they correlate against coding test submissions and viva answers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div className="text-[11px] font-bold uppercase tracking-wider">Supported by Evidence</div>
              <div className="text-2xl font-extrabold mt-1">82.4%</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">234 Claims fully verified via code & docs</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <div className="text-[11px] font-bold uppercase tracking-wider">Needs Clarification</div>
              <div className="text-2xl font-extrabold mt-1">11.6%</div>
              <div className="text-[11px] text-amber-700 mt-0.5">33 Claims flagged for adaptive follow-up</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">
              <div className="text-[11px] font-bold uppercase tracking-wider">Pending Evaluation</div>
              <div className="text-2xl font-extrabold mt-1">6.0%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">17 Claims awaiting scheduled viva</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recent Audited Candidate Claims (Across Streams)
            </h4>

            {[
              { candidate: 'Aarav Sharma', stream: 'Computer Science & IT', claim: 'Redis Caching & 5,000 RPS Throughput', status: 'Supported by available evidence', note: 'Corroborated by Locust load tests & architectural specs' },
              { candidate: 'Priya Nair', stream: 'Data Science & AI', claim: 'Vector Search with FAISS & Embeddings', status: 'Supported by available evidence', note: 'Validated during technical viva explanation' },
              { candidate: 'Rohan Verma', stream: 'Core Engineering (ECE)', claim: 'FPGA Hardware Acceleration Prototype', status: 'Needs clarification', note: 'Follow-up viva scheduled to verify test benches' },
              { candidate: 'Sneha Patel', stream: 'Management & MBA', claim: 'Cross-functional Supply Chain Process Optimization', status: 'Supported by available evidence', note: 'Corroborated by case study deliverables' },
            ].map((cl, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{cl.candidate}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{cl.stream}</span>
                  </div>
                  <div className="font-semibold text-slate-800 mt-1">Claim: "{cl.claim}"</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{cl.note}</div>
                </div>
                <div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    cl.status === 'Supported by available evidence'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {cl.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Dossier Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center">
                  {selectedCandidate.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCandidate.full_name}</h3>
                  <p className="text-xs text-slate-500">{selectedCandidate.email} • {selectedCandidate.stream}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Target Role</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedCandidate.target_role}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Readiness Score</span>
                <div className="font-extrabold text-indigo-600 text-base mt-0.5">{selectedCandidate.readiness_score}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Aptitude Score</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedCandidate.aptitude_score}% Pass</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Coding Pass Rate</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedCandidate.coding_score}% Pass</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-xs">
              <span className="font-bold text-indigo-900">Evidence Corroboration Trail:</span>
              <p className="text-indigo-800 mt-1">{selectedCandidate.evidence_status}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
              >
                Close
              </button>
              <Link
                to="/reports"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <span>Full Evaluation Dossier</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Campus Drive Modal */}
      {showDriveModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule Campus Placement Drive</h3>
              <button
                onClick={() => setShowDriveModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Oracle, Cisco, Adobe"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Designation / Role</label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Software Engineer, Data Analyst"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CTC Package</label>
                  <input
                    type="text"
                    value={newPackage}
                    onChange={(e) => setNewPackage(e.target.value)}
                    placeholder="e.g. 18.0 LPA"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Readiness Score</label>
                  <input
                    type="number"
                    value={newMinScore}
                    onChange={(e) => setNewMinScore(parseInt(e.target.value) || 70)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Drive Scheduled Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDriveModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Schedule Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
