import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { FileText, Plus, CheckCircle2, BookOpen } from 'lucide-react';

export const LearningResourceManager: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('System Design');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await adminApi.getResources();
      setResources(data);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);

    try {
      await adminApi.createLearningResource({ title, category, topic, content });
      setSuccess('Resource ingested into RAG vector repository successfully!');
      setTitle('');
      setTopic('');
      setContent('');
      await fetchResources();
    } catch (err) {
      console.error('Failed to save resource:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Learning Resource Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Curate verified domain literature, syllabus modules, and interview preparation notes for RAG contextual retrieval.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Add Resource Form */}
      <form onSubmit={handleAddResource} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Add Approved Study Resource to Vector Store</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Resource Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Caching Patterns"
              className="w-full px-3 py-1.5 border rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-xs"
            >
              <option value="System Design">System Design</option>
              <option value="DBMS">Database Architecture</option>
              <option value="DSA">Data Structures & Algorithms</option>
              <option value="Operating Systems">Operating Systems</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Topic</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Redis Cache Invalidation"
              className="w-full px-3 py-1.5 border rounded-lg text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Resource Text Content (Ingested for RAG)</label>
          <textarea
            rows={4}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste syllabus summary, conceptual cheat-sheet, or algorithmic trade-off reference text..."
            className="w-full p-3 border rounded-xl text-xs focus:outline-none"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            {saving ? 'Ingesting into RAG...' : 'Ingest Resource'}
          </button>
        </div>
      </form>

      {/* Existing Resources List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Existing Approved Resources ({resources.length})</h3>
        {resources.length === 0 ? (
          <div className="text-xs text-slate-500 italic">No resources added yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {resources.map((r) => (
              <div key={r.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{r.title}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                      {r.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">{r.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0">RAG Approved</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
