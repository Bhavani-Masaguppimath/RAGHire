import React, { useState, useEffect } from 'react';
import { projectDefenseApi } from '../../services/api';
import { ProjectData } from '../../types';
import {
  ShieldAlert,
  UploadCloud,
  FileText,
  Sparkles,
  BookOpen,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Database,
  Cpu
} from 'lucide-react';

export const ProjectDefense: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [defenseAnswer, setDefenseAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // New Project Form State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArchitecture, setNewArchitecture] = useState('');
  const [newDbDesign, setNewDbDesign] = useState('');
  const [newTechs, setNewTechs] = useState('Python, FastAPI, Redis, Docker, PostgreSQL');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectDefenseApi.getProjects();
      setProjects(data);
      if (data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await projectDefenseApi.createProject({
        title: newTitle,
        architecture_overview: newArchitecture,
        database_design: newDbDesign,
        technologies: newTechs.split(',').map((t) => t.trim()),
      });
      setShowNewModal(false);
      setProjects([...projects, created]);
      setSelectedProjectId(created.id);
      setStatusMsg(`Project "${created.title}" registered successfully.`);
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleUploadReport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProjectId) return;
    setUploadingDoc(true);
    setStatusMsg(null);

    try {
      await projectDefenseApi.uploadDocument(selectedProjectId, file);
      setStatusMsg(`Document "${file.name}" ingested into RAG vector index successfully!`);
      await fetchProjects();
    } catch (err) {
      console.error('Failed to upload document:', err);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleLoadSampleReport = async () => {
    if (!selectedProjectId) return;
    setUploadingDoc(true);
    setStatusMsg(null);
    try {
      await projectDefenseApi.loadSampleDocument(selectedProjectId);
      setStatusMsg('Sample Architecture Report ingested into RAG vector index successfully!');
      await fetchProjects();
    } catch (err) {
      console.error('Failed to load sample report:', err);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!selectedProjectId) return;
    setIsGenerating(true);
    setEvaluation(null);
    try {
      const qs = await projectDefenseApi.generateQuestions(selectedProjectId);
      setQuestions(qs);
      setCurrentQIndex(0);
      setDefenseAnswer('');
    } catch (err) {
      console.error('Failed to generate defense questions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!selectedProjectId || !defenseAnswer.trim() || isEvaluating) return;
    setIsEvaluating(true);
    const q = questions[currentQIndex];

    try {
      const res = await projectDefenseApi.evaluateAnswer(selectedProjectId, q.question_text, defenseAnswer);
      setEvaluation(res);
    } catch (err) {
      console.error('Failed to evaluate defense answer:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const activeProject = projects.find((p) => p.id === selectedProjectId);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project Defense & RAG Viva Engine</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest project reports into the RAG vector store to simulate rigorous external examiner vivas with source citations.
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          + Add New Project
        </button>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Project Selector & Details */}
      {activeProject && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Defense Project</span>
              <h2 className="text-base font-bold text-slate-900">{activeProject.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
                <span>{uploadingDoc ? 'Ingesting Chunks...' : 'Upload Report (PDF/DOCX)'}</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleUploadReport}
                  disabled={uploadingDoc}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleLoadSampleReport}
                disabled={uploadingDoc}
                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 disabled:opacity-50"
                title="Load sample architecture report for RAG testing"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Load Sample Report</span>
              </button>

              <button
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Synthesizing with RAG...' : 'Generate Viva Questions'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
            <div>
              <strong className="text-slate-800 block mb-1">Architecture Overview:</strong>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                {activeProject.architecture_overview || 'No architecture notes provided.'}
              </p>
            </div>
            <div>
              <strong className="text-slate-800 block mb-1">Database & Normalization:</strong>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                {activeProject.database_design || 'No database design notes provided.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
            <span>Ingested Documents:</span>
            {activeProject.documents.length === 0 ? (
              <span className="italic text-slate-400">None uploaded yet (upload report above for RAG citations)</span>
            ) : (
              activeProject.documents.map((d) => (
                <span key={d.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  <FileText className="w-3 h-3 text-indigo-600" />
                  <span>{d.filename} ({d.chunk_count} vector chunks)</span>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* RAG Generated Defense Questions */}
      {questions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Defense Question {currentQIndex + 1} of {questions.length} • {questions[currentQIndex]?.category}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Source: {questions[currentQIndex]?.source_reference}
            </span>
          </div>

          <h2 className="text-base font-bold text-slate-900 leading-relaxed">
            {questions[currentQIndex]?.question_text}
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">Your Defense Justification:</label>
            <textarea
              rows={5}
              value={defenseAnswer}
              onChange={(e) => setDefenseAnswer(e.target.value)}
              disabled={isEvaluating}
              placeholder="Defend your architectural trade-offs, database indexing, and scalability mitigation strategies..."
              className="w-full p-4 border border-slate-300 rounded-xl text-xs md:text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentQIndex(idx);
                    setDefenseAnswer('');
                    setEvaluation(null);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentQIndex === idx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleEvaluateAnswer}
              disabled={!defenseAnswer.trim() || isEvaluating}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEvaluating ? 'Checking Citations...' : 'Defend Answer'}</span>
            </button>
          </div>

          {/* Defense Evaluation Box */}
          {evaluation && (
            <div className="mt-6 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  Viva Examiner Assessment
                </span>
                <span className="text-xs font-bold text-slate-900 bg-white px-3 py-1 rounded-full border border-slate-200">
                  Rating: {evaluation.score}/10
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {evaluation.ai_feedback}
              </p>

              {evaluation.source_citation && (
                <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-slate-600">
                  <strong className="text-indigo-900 block mb-1">RAG Context Citation:</strong>
                  <span className="font-mono text-[11px] text-slate-700">{evaluation.source_citation}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Capstone / Technical Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Task Scheduler with Raft"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={newTechs}
                  onChange={(e) => setNewTechs(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Architecture Summary</label>
                <textarea
                  rows={2}
                  value={newArchitecture}
                  onChange={(e) => setNewArchitecture(e.target.value)}
                  placeholder="Service boundaries, message bus, load balancing..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Database Design</label>
                <textarea
                  rows={2}
                  value={newDbDesign}
                  onChange={(e) => setNewDbDesign(e.target.value)}
                  placeholder="Relational schema, B-Tree indexes, normalization level..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border rounded-lg font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
