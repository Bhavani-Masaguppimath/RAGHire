import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Target,
  Brain,
  Code2,
  Mic,
  Users,
  ShieldAlert,
  SearchCheck,
  Sparkles,
  BarChart3,
  History,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Menu,
  X,
  GraduationCap,
  Briefcase,
  Compass,
  Building2,
  CheckCircle2,
  Eye,
  ShieldCheck
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Student Navigation Items
  const studentNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/profile', icon: UserCheck },
    { label: 'Resume Analysis', path: '/resume', icon: FileText },
    { label: 'Target Job Role', path: '/target-role', icon: Target },
    { label: 'Aptitude Prep', path: '/aptitude', icon: Brain },
    { label: 'Coding Workspace', path: '/coding', icon: Code2 },
    { label: 'Technical Interview', path: '/interview/technical', icon: Mic },
    { label: 'HR Practice', path: '/interview/hr', icon: Users },
    { label: 'Project Defense', path: '/project-defense', icon: ShieldAlert },
    { 
      label: 'Evidence Tracking', 
      path: '/evidence', 
      icon: SearchCheck,
      badge: 'AI Audit'
    },
    { label: 'Learning Plan', path: '/learning-plan', icon: Sparkles },
    { label: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
    { label: 'Session History', path: '/history', icon: History },
  ];

  // Administrator / Placement Director Navigation Items
  const adminNavItems = [
    { label: 'Director Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Candidate Cohort Directory', path: '/admin/candidates', icon: Users, badge: '128' },
    { label: 'Multi-Stream Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Campus Placement Drives', path: '/admin/drives', icon: Briefcase, badge: '5 Active' },
    { label: 'Central Question Bank', path: '/admin/questions', icon: Brain },
    { label: 'RAG Knowledge & Curricula', path: '/admin/resources', icon: FileText },
    { label: 'Evidence Audit Inspector', path: '/admin/evidence', icon: SearchCheck, badge: 'AI Audit' },
    { label: 'Platform Settings', path: '/settings', icon: Settings },
  ];

  // Display strictly the navigation belonging to the user's role
  const activeNavItems = isAdmin ? adminNavItems : studentNavItems;

  const getCandidateSubtitle = () => {
    if (user?.role === 'admin') return 'Placement Administrator';
    if (user?.profile?.degree) {
      const deg = user.profile.degree;
      return deg.length > 25 ? deg.slice(0, 22) + '...' : deg;
    }
    return 'Candidate • All Streams';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 text-slate-300 select-none flex-shrink-0">
        {/* Brand header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2.5 group">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 ${
              isAdmin 
                ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-indigo-600/30'
                : 'bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-indigo-600/30'
            }`}>
              {isAdmin ? <ShieldCheck className="w-5 h-5 text-white" /> : <GraduationCap className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">RAGHire</span>
              <span className="block text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                {isAdmin ? 'PLACEMENT DIRECTOR CELL' : 'AI Placement Platform'}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>{isAdmin ? 'Director Controls' : 'Preparation Modules'}</span>
            <span className="text-[9px] font-medium text-slate-600 lowercase">
              {isAdmin ? 'placement cell' : 'all streams'}
            </span>
          </div>

          {activeNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/dashboard' && item.path !== '/admin' && location.pathname.startsWith(item.path)) ||
              (isAdmin && location.pathname === '/dashboard' && item.path === '/admin');

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-900 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
              isAdmin
                ? 'bg-indigo-600/30 border border-indigo-500/40 text-indigo-300'
                : 'bg-indigo-600/30 border border-indigo-500/40 text-indigo-300'
            }`}>
              {user?.full_name?.charAt(0) || (isAdmin ? 'D' : 'C')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{user?.full_name || (isAdmin ? 'Director' : 'Candidate')}</div>
              <div className="text-[10px] text-slate-400 truncate">{getCandidateSubtitle()}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Context Badge */}
            <div className="hidden sm:flex items-center gap-2">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Campus Placement Cell • Director Command Center</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  <span>All Academic Streams Welcome</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* AI Status Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isAdmin ? 'Live Cohort Monitoring Active' : 'AI Evaluation Active'}</span>
            </div>

            {/* Notification Bell */}
            <button 
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-all text-left"
              >
                <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs ${
                  isAdmin 
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-800'
                    : 'bg-gradient-to-br from-indigo-600 to-indigo-800'
                }`}>
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">{user?.full_name || 'User'}</div>
                  <div className="text-[10px] text-slate-500">{getCandidateSubtitle()}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30">
                  <div className="px-3.5 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{user?.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <p className="text-[10px] text-indigo-600 font-semibold mt-0.5 truncate">{getCandidateSubtitle()}</p>
                  </div>

                  {!isAdmin && (
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                      <span>Candidate Profile</span>
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                      <span>Director Dashboard</span>
                    </Link>
                  )}

                  <Link
                    to="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Workspace Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 border-t border-slate-100 text-left font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-1 z-30">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {isAdmin ? 'Director Controls' : 'Preparation Modules'}
            </div>
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] bg-slate-900 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Main Routed Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
