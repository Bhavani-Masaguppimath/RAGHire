import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileApi } from '../../services/api';
import { StudentProfile } from '../../types';
import {
  UserCheck,
  Building,
  GraduationCap,
  Calendar,
  Briefcase,
  Github,
  Linkedin,
  Phone,
  Save,
  CheckCircle2,
  Plus,
  X,
  Compass,
  Sparkles,
  Award,
  Globe,
  FileCheck
} from 'lucide-react';

export const MyProfile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<Partial<StudentProfile>>({});
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const streamOptions = [
    'Computer Science & Information Technology',
    'Electronics & Electrical Engineering',
    'Mechanical, Civil & Core Engineering',
    'Data Science & Artificial Intelligence',
    'Business Administration & Management (MBA / BBA)',
    'Commerce, Finance & Accounts',
    'Pure & Applied Sciences (B.Sc / M.Sc)',
    'Humanities, Design & Social Sciences',
    'Any Other Academic Discipline'
  ];

  const suggestedSkills = [
    'Python', 'Java', 'SQL', 'React', 'TypeScript', 'Docker',
    'Data Structures', 'System Design', 'Git', 'Machine Learning',
    'Problem Solving', 'Communication'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileApi.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await profileApi.updateProfile(profile);
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const addSkill = (skillToAdd?: string) => {
    const target = (skillToAdd || newSkill).trim();
    if (!target) return;
    const currentSkills = profile.skills || [];
    if (!currentSkills.includes(target)) {
      setProfile({ ...profile, skills: [...currentSkills, target] });
    }
    if (!skillToAdd) setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: (profile.skills || []).filter((s) => s !== skillToRemove),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-indigo-600/30 border border-white/20">
              {user?.full_name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{user?.full_name || 'Candidate'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Profile Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{profile.degree || 'Academic Candidate'} • Batch {profile.graduation_year || 2026}</p>
              <div className="text-[11px] text-indigo-300 font-medium flex items-center gap-1.5 mt-1">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>Target: {profile.target_job_role || 'Full Stack Software Engineer'}</span>
              </div>
            </div>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Changes Saved!</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Academic Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Academic Details & Degree Stream</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Students and candidates from all academic streams (Engineering, Science, Business, Management, Humanities) can customize their credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={user?.full_name || ''}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">College / Department</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={profile.college || ''}
                  onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                  placeholder="e.g. University Institute of Technology / Science"
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Program / Branch</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={profile.degree || ''}
                  onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                  placeholder="e.g. B.Tech / B.E. / BCA / B.Sc / MBA / M.Tech / Any Stream"
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Passing Year</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  value={profile.graduation_year || 2026}
                  onChange={(e) => setProfile({ ...profile, graduation_year: parseInt(e.target.value) || 2026 })}
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Target Job Role Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Target Placement Role</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Selected Target Role</label>
              <select
                value={profile.target_job_role || 'Full Stack Software Engineer'}
                onChange={(e) => setProfile({ ...profile, target_job_role: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white"
              >
                <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
                <option value="Backend Systems Engineer">Backend Systems Engineer</option>
                <option value="Data & AI Engineer">Data & AI Engineer</option>
                <option value="Cloud & DevOps Associate">Cloud & DevOps Associate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Level</label>
              <select
                value={profile.experience_level || 'Fresher / Entry-Level'}
                onChange={(e) => setProfile({ ...profile, experience_level: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white"
              >
                <option value="Fresher / Entry-Level">Fresher / Entry-Level (2026 Batch)</option>
                <option value="Internship Experience">Internship Experience (3-6 Months)</option>
                <option value="1-2 Years Experience">Junior Professional (1-2 Years)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Technical & Analytical Skills Tag Input */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Competencies & Skills</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Skills featured on your resume or acquired during your degree coursework and practical projects.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="e.g. Python, SQL, React, Problem Solving, Docker..."
              className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => addSkill()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Add:</span>
            {suggestedSkills.map((sk) => (
              <button
                key={sk}
                type="button"
                onClick={() => addSkill(sk)}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 transition-colors"
              >
                + {sk}
              </button>
            ))}
          </div>

          {/* Active Skills Badges */}
          <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-slate-50 rounded-xl border border-slate-200">
            {(profile.skills || []).map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-300 text-slate-800 text-xs font-medium shadow-xs"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Professional Bio & Social Links */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Placement Bio</label>
            <textarea
              rows={3}
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Ambitious candidate passionate about software engineering, scalable architectures, and analytical problem-solving..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Profile URL</label>
              <div className="relative">
                <Github className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={profile.github_url || ''}
                  onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                  placeholder="https://github.com/your-username"
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
              <div className="relative">
                <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={profile.linkedin_url || ''}
                  onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-600/30 transition-all text-xs sm:text-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};
