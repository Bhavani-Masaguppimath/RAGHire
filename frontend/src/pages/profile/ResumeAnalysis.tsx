import React, { useState, useEffect } from 'react';
import { resumeApi } from '../../services/api';
import { ResumeData, ResumeAnalysisResponse } from '../../types';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Save,
  Check,
  X,
  Plus,
  BookOpen,
  Sparkles,
  Layers
} from 'lucide-react';

export const ResumeAnalysis: React.FC = () => {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [isEditing, setIsEditing] = useState(false);
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [newSkillText, setNewSkillText] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const data = await resumeApi.getActiveResume();
      setResume(data);
      setEditSkills(data.parsed_skills || []);
    } catch (err) {
      console.log('No active resume yet.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg(null);
    setUploadSuccess(null);

    try {
      const res: ResumeAnalysisResponse = await resumeApi.uploadResume(file, targetRole);
      setUploadSuccess(`Resume "${file.name}" uploaded and parsed successfully!`);
      await fetchResume();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to upload and process resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleLoadSample = async () => {
    setUploading(true);
    setErrorMsg(null);
    setUploadSuccess(null);
    try {
      await resumeApi.loadSample(targetRole);
      setUploadSuccess('Sample Benchmark Candidate Resume loaded and evaluated successfully!');
      await fetchResume();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to load sample resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveEdits = async () => {
    try {
      const updated = await resumeApi.editExtracted({
        parsed_skills: editSkills,
        target_job_role: targetRole,
      });
      setResume(updated);
      setIsEditing(false);
      setUploadSuccess('Extracted details updated successfully.');
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (err) {
      setErrorMsg('Failed to update extracted skills.');
    }
  };

  const addSkill = () => {
    if (!newSkillText.trim()) return;
    if (!editSkills.includes(newSkillText.trim())) {
      setEditSkills([...editSkills, newSkillText.trim()]);
    }
    setNewSkillText('');
  };

  const removeSkill = (s: string) => {
    setEditSkills(editSkills.filter((item) => item !== s));
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
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Resume & Skill-Gap Analysis</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload your resume (PDF or DOCX) to benchmark extracted skills against target campus recruitment roles.
        </p>
      </div>

      {uploadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center hover:border-indigo-500 transition-colors">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">Upload Your Resume</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Supports PDF or DOCX formats up to 15MB.
          </p>

          <div className="flex items-center gap-3 w-full justify-center mb-4">
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="Full Stack Software Engineer">Benchmark vs: Full Stack Software Engineer</option>
              <option value="Backend Systems Engineer">Benchmark vs: Backend Systems Engineer</option>
              <option value="Data & AI Engineer">Benchmark vs: Data & AI Engineer</option>
              <option value="Cloud & DevOps Associate">Benchmark vs: Cloud & DevOps Associate</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg text-xs shadow-sm transition-all flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{uploading ? 'Extracting Text & Skills...' : 'Select Resume File'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={handleLoadSample}
              disabled={uploading}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-slate-300 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Load Benchmark Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Resume Analysis Results */}
      {resume && (
        <div className="space-y-6">
          {/* Match Score Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                <span>Active Document:</span>
                <span className="text-slate-800 lowercase font-mono">{resume.filename}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Target Role Alignment: {resume.match_score}%
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-lg">
                Calculated by semantic matching against required core technologies for {targetRole}.
              </p>
            </div>

            <div className="w-full md:w-64">
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Skill Match</span>
                <span>{resume.match_score}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${resume.match_score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Extracted Details & Correction Mode */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Extracted Skills & Competencies</h3>
                <p className="text-xs text-slate-500">
                  Notice: AI text extraction may make omissions. You can review and correct inaccurate items below.
                </p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Edit Extracted Data</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveEdits}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Corrections</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditSkills(resume.parsed_skills || []);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-medium hover:bg-slate-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Editable or View Mode */}
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                    placeholder="Add missing skill (e.g. AWS, Docker)"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    onClick={addSkill}
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {editSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-300 text-xs font-medium text-slate-800"
                    >
                      <span>{s}</span>
                      <button onClick={() => removeSkill(s)} className="text-slate-400 hover:text-rose-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(resume.parsed_skills || []).map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Matching vs Missing Skills Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matching */}
            <div className="bg-white rounded-2xl border border-emerald-200/80 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Check className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Matching Role Skills</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {(resume.matching_skills || []).map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Missing Competencies</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {(resume.missing_skills || []).map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Suggested Preparation Topics */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800">Suggested Preparation Topics</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(resume.suggested_topics || []).map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-2 text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
