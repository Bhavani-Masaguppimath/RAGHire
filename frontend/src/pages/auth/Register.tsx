import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  ArrowRight, 
  Lock, 
  Mail, 
  User as UserIcon, 
  AlertCircle, 
  Compass, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [stream, setStream] = useState('Computer Science & IT');
  const [degree, setDegree] = useState('B.Tech / B.E.');
  const [college, setCollege] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const streamOptions = [
    'Computer Science & IT',
    'Electronics & Electrical Engineering',
    'Mechanical, Civil & Core Engineering',
    'Data Science & Artificial Intelligence',
    'Business Administration & Management (MBA / BBA)',
    'Commerce, Accounts & Economics',
    'Pure & Applied Sciences (B.Sc / M.Sc)',
    'Arts, Humanities & Social Sciences',
    'Any Other Academic Stream'
  ];

  const quickDegreeChips = [
    'B.Tech / B.E.',
    'BCA',
    'B.Sc / M.Sc',
    'M.Tech',
    'MBA / BBA',
    'B.Com / Finance',
    'Engineering / Tech',
    'All Other Degrees'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(email, password, fullName, role, stream, degree, college);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-indigo-600/20 via-sky-600/10 to-transparent blur-3xl opacity-60" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center relative z-10 mb-6">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">RAGHire</span>
        </Link>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Create Your Candidate Account
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
          Open to students & job candidates from <span className="text-indigo-400 font-semibold">all academic streams</span> and degree programs.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-slate-900/90 border border-slate-800/90 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl backdrop-blur-xl">
          {/* Inclusivity Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-indigo-200">Universal Placement Preparation: </span>
              <span className="text-indigo-300/80">
                Syllabi, aptitude sets, and viva rubrics adapt dynamically to your academic discipline.
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Account Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                    role === 'student'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🎓 Student Candidate</span>
                  {role === 'student' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                    role === 'admin'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🛡️ Placement Officer / Admin</span>
                  {role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@college.edu or personal@email.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Academic Stream & Discipline (For candidates) */}
            {role === 'student' && (
              <>
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Academic Stream / Discipline
                    </label>
                    <span className="text-[11px] text-indigo-400">All streams welcome</span>
                  </div>
                  <div className="relative">
                    <Compass className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <select
                      value={stream}
                      onChange={(e) => setStream(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all appearance-none cursor-pointer"
                    >
                      {streamOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Degree Program */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Degree / Qualification
                    </label>
                  </div>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech / B.E. / BCA / B.Sc / MBA / M.Tech / Any Academic Stream"
                    className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all mb-2"
                  />
                  {/* Quick Degree Pill Selectors */}
                  <div className="flex flex-wrap gap-1.5">
                    {quickDegreeChips.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setDegree(chip)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          degree === chip
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* College / University Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    College / University (Optional)
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. National Institute of Technology / University Campus"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-xs sm:text-sm disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 pt-4 border-t border-slate-800/80">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
