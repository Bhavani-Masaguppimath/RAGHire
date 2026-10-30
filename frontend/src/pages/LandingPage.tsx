import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Brain,
  Code2,
  Mic,
  ShieldAlert,
  SearchCheck,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  FileText,
  Users,
  Check,
  Globe2,
  Terminal,
  Briefcase
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [selectedStream, setSelectedStream] = useState<string>('all');

  const streamFilters = [
    { id: 'all', label: 'All Streams & Degrees' },
    { id: 'cs', label: 'Computer Science & IT' },
    { id: 'eng', label: 'Core Engineering (ECE, EEE, Mech, Civil)' },
    { id: 'data', label: 'Data Science & AI' },
    { id: 'mgmt', label: 'Business & Management (MBA/BBA)' },
    { id: 'sci', label: 'Sciences & Allied Disciplines' }
  ];

  const streamInfo: Record<string, { role: string; desc: string; keyFocus: string[] }> = {
    all: {
      role: 'Universal Career Preparation',
      desc: 'Whether you are in Computer Science, Mechanical Engineering, Electronics, Business Administration, or Pure Sciences, RAGHire customizes aptitude tests, technical rounds, coding sandboxes, and behavioral viva directly for your target profile.',
      keyFocus: ['Quantitative & Logical Aptitude', 'Technical Core Knowledge', 'Behavioral HR Interview (STAR)', 'Resume & Project Evidence Audit']
    },
    cs: {
      role: 'Full Stack & Software Engineering',
      desc: 'Master algorithms, system design, modern full-stack web stacks, and database optimization with real-time sandboxed code execution in Python & Java.',
      keyFocus: ['Data Structures & Algorithms', 'System Architecture & Concurrency', 'REST APIs & Microservices', 'RAG Capstone Project Defense']
    },
    eng: {
      role: 'Core Engineering & Technology',
      desc: 'Bridging engineering fundamentals with software competencies, analytical troubleshooting, and corporate screening benchmarks.',
      keyFocus: ['Core Technical Fundamentals', 'Analytical Reasoning', 'Python Automation & Scripting', 'Engineering Project Defense']
    },
    data: {
      role: 'Data Science & Machine Learning',
      desc: 'Designed for statistics, AI, and data analysts. Practice SQL data manipulation, ML model pipelines, and metric evaluation defense.',
      keyFocus: ['SQL & Data Transformations', 'Vector DBs & LLM Architectures', 'Statistical Modeling', 'Predictive Pipeline Defense']
    },
    mgmt: {
      role: 'Business Analytics & Consulting',
      desc: 'Case studies, executive articulation, STAR method behavioral viva, situational leadership evaluations, and commercial acumen.',
      keyFocus: ['STAR Behavioral Framework', 'Strategic Decision Articulation', 'Quantitative Case Analysis', 'Leadership & Team Management']
    },
    sci: {
      role: 'Applied Sciences & Research',
      desc: 'Formulate rigorous research defense, analytical logic tests, computational problem solving, and corporate recruitment readiness.',
      keyFocus: ['Critical Thinking & Logic', 'Computational Modeling', 'Viva Defense Q&A', 'Resume Alignment Engine']
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Mesh Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-sky-600/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[35%] -left-48 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-[60%] -right-48 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">RAGHire</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Universal Prep
                </span>
              </div>
              <span className="block text-[11px] text-slate-400 font-medium">AI Career & Placement Acceleration Platform</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#streams" className="hover:text-white transition-colors">All Academic Streams</a>
            <a href="#modules" className="hover:text-white transition-colors">10 Prep Modules</a>
            <a href="#traceability" className="hover:text-white transition-colors">Evidence Traceability</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          {/* Top Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-8 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Open to students & candidates from all academic streams</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-400">Engineering, Science, Business & Tech</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Prepare. Practise. Excel. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">
              Get 100% Placement-Ready.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            A comprehensive, multi-round placement readiness suite equipped with <strong className="text-white font-semibold">Retrieval-Augmented Generation (RAG)</strong>, sandboxed code execution, AI voice interviews, and an innovative <span className="text-indigo-300 font-medium">Cross-Round Evidence Traceability Engine</span> that connects your resume, coding artifacts, and viva answers.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all text-sm sm:text-base group"
            >
              <span>Explore Candidate Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-medium px-8 py-3.5 rounded-xl transition-all text-sm sm:text-base hover:border-slate-600"
            >
              <span>Sign In with Demo Credentials</span>
            </Link>
          </div>

          {/* Trust and Feature Counters */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80 pt-8 text-left">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl font-bold text-white">10 Modules</div>
              <div className="text-xs text-slate-400 mt-0.5">End-to-End Placement Cycle</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl font-bold text-indigo-400">All Streams</div>
              <div className="text-xs text-slate-400 mt-0.5">Tech, Non-Tech & Core Branches</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl font-bold text-sky-400">Judge0 Sandbox</div>
              <div className="text-xs text-slate-400 mt-0.5">Python & Java Code Execution</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl font-bold text-emerald-400">AI Traceability</div>
              <div className="text-xs text-slate-400 mt-0.5">Cross-Round Evidence Audit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Academic Stream Inclusivity Section */}
      <section id="streams" className="py-20 px-4 sm:px-6 bg-slate-900/50 border-y border-slate-800/80 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-semibold mb-3">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Universal Academic Discipline Support</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Empowering Students & Candidates From Any Academic Stream
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              RAGHire does not restrict candidates by background. Select your discipline to explore tailored placement pathways.
            </p>
          </div>

          {/* Stream Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {streamFilters.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStream(s.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedStream === s.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Dynamic Stream Detail Showcase */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">Tailored Pathway</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{streamInfo[selectedStream].role}</h3>
              </div>
              <Link
                to="/register"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <span>Register with this discipline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              {streamInfo[selectedStream].desc}
            </p>

            <div className="mt-6 pt-4 border-t border-slate-800/70">
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider block mb-3">
                Key Assessment & Preparation Dimensions:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {streamInfo[selectedStream].keyFocus.map((kf, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{kf}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core AI Innovation Spotlight */}
      <section id="traceability" className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold mb-4">
                <SearchCheck className="w-3.5 h-3.5" />
                <span>AI Verification Engine</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                Cross-Round Evidence Traceability & Adaptive Follow-Up Engine
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Recruiters test for authenticity. RAGHire connects claims across a candidate's resume, capstone projects, coding submissions, and viva answers. When claims lack documented corroboration, the engine asks respectful, non-accusatory follow-up questions to validate practical depth.
              </p>
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Respectful Inquiries:</strong> Absence of initial evidence is never treated as dishonesty or false representation.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Four Transparent Statuses:</strong> Supported by evidence, Needs clarification, Not verified, and Potentially inconsistent.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Interactive Feedback Loop:</strong> Candidate explanations automatically update the evidence trail with verifiable timestamps.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Monitor Mockup */}
            <div className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="text-xs font-mono text-slate-400 mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span>EVIDENCE_TRACEABILITY_GRAPH</span>
                </div>
                <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE AUDIT
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-semibold text-slate-200">Claim: Redis Caching (10k RPS)</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Supported
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Corroborated by Project Specification Section 3.1 architecture and pub/sub caching benchmark.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-amber-800/50 hover:border-amber-700/70 transition-all">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-semibold text-slate-200">Claim: Microservices Benchmarking</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                      Needs clarification
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Follow-up: "Could you describe the infrastructure and load testing specs used to record the 5,000 RPS benchmark?"
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Candidate Response Logged:</span>
                  <span className="text-indigo-400 font-mono">Status updated to Supported</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ten Modules Grid */}
      <section id="modules" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Complete Screening Curriculum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Ten Comprehensive Preparation Modules</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            From preliminary resume alignment to timed aptitude rounds, sandboxed coding challenges, AI viva, and final placement readiness reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "1. Profile & Resume Analysis", desc: "PDF/DOCX extraction, skill-gap analysis, and keyword benchmark matching against industry roles.", icon: FileText, tag: "Screening" },
            { title: "2. Aptitude Preparation", desc: "Timed mock exams for Quantitative, Logical, Verbal, and Analytical reasoning with step-by-step solutions.", icon: Brain, tag: "Round 1" },
            { title: "3. Coding Assessment", desc: "Monaco editor workspace for Python & Java with isolated Judge0 / sandbox test-case validation.", icon: Code2, tag: "Round 2" },
            { title: "4. Technical Interview", desc: "Interactive multi-rubric voice & text evaluation on correctness, completeness, clarity, and depth.", icon: Mic, tag: "Round 3" },
            { title: "5. HR & Communication", desc: "STAR method feedback on behavioral, situational, and leadership responses with voice recording.", icon: Users, tag: "Round 4" },
            { title: "6. Project Defense Viva", desc: "Deep viva questions referencing architectural decisions in uploaded technical project documentation.", icon: ShieldAlert, tag: "Viva" },
            { title: "7. AI Question Generation", desc: "Tenant-isolated vector retrieval with strict prompt injection sanitization and dynamic difficulty.", icon: Cpu, tag: "Engine" },
            { title: "8. Evidence Traceability", desc: "Cross-round audit connecting claims across documents, coding tests, and interview transcripts.", icon: SearchCheck, tag: "Audit" },
            { title: "9. Personalized Learning", desc: "Dynamically updated study roadmap focused directly on identified candidate weak areas.", icon: Sparkles, tag: "Growth" },
            { title: "10. Performance Dashboard", desc: "Visual competency radars, readiness trend graphs, and exportable comprehensive placement dossiers.", icon: BarChart3, tag: "Reports" }
          ].map((m, idx) => {
            const Icon = m.icon;
            return (
              <div 
                key={idx} 
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{m.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-indigo-900/80 via-slate-900 to-indigo-950/80 border border-indigo-700/40 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Begin Your Placement Preparation Today
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8">
              Join students and job seekers across all streams improving their aptitude scores, coding confidence, and interview performance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-950 font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 transition-all text-sm shadow-lg shadow-white/10"
              >
                <span>Register for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-950/60 hover:bg-indigo-900/80 text-white font-medium px-8 py-3.5 rounded-xl border border-indigo-700/50 transition-all text-sm"
              >
                <span>Sign In to Existing Account</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Professional Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-4 sm:px-6 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-300">RAGHire Platform</span>
            <span>—</span>
            <span>AI-Powered Placement & Career Readiness Platform</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Candidate Dashboard</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} RAGHire. Built for candidates and placement cells across all academic streams.</p>
          <p>Powered by React, TypeScript, FastAPI, SQLAlchemy & Judge0 Isolated Execution</p>
        </div>
      </footer>
    </div>
  );
};
