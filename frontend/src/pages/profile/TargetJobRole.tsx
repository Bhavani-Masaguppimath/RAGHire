import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileApi } from '../../services/api';
import { TargetRoleInfo } from '../../types';
import { Target, CheckCircle2, ArrowRight, Code, Database, Server, Cloud } from 'lucide-react';

export const TargetJobRole: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [roles, setRoles] = useState<TargetRoleInfo[]>([]);
  const [currentRole, setCurrentRole] = useState(user?.profile?.target_job_role || 'Full Stack Software Engineer');
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await profileApi.getTargetRoles();
        setRoles(data);
      } catch (err) {
        console.error('Failed to load target roles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleSelectRole = async (roleTitle: string) => {
    try {
      await profileApi.updateProfile({ target_job_role: roleTitle });
      setCurrentRole(roleTitle);
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update target role:', err);
    }
  };

  const getRoleIcon = (title: string) => {
    if (title.includes('Full Stack')) return Code;
    if (title.includes('Backend')) return Server;
    if (title.includes('Data')) return Database;
    return Cloud;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Target Placement Role</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your preferred campus recruitment profile to calibrate coding, aptitude, and interview benchmarks.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Target role updated!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((r) => {
          const Icon = getRoleIcon(r.role_title);
          const isSelected = currentRole === r.role_title;

          return (
            <div
              key={r.role_title}
              className={`bg-white rounded-2xl border p-6 shadow-sm transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-600/10'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Active Target</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{r.role_title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{r.description}</p>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Required Tech Stack:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {r.required_skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Core CS Subjects:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {r.core_subjects.map((sub) => (
                        <span key={sub} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[11px] font-medium border border-indigo-100">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleSelectRole(r.role_title)}
                  disabled={isSelected}
                  className={`w-full py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                  }`}
                >
                  <span>{isSelected ? 'Currently Selected' : 'Set as My Target Role'}</span>
                  {!isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
