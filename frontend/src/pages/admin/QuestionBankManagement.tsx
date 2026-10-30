import React, { useState } from 'react';
import { adminApi } from '../../services/api';
import { Brain, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export const QuestionBankManagement: React.FC = () => {
  const [category, setCategory] = useState('quantitative');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionText, setQuestionText] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanation, setExplanation] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opt0 || !opt1 || !opt2 || !opt3) {
      setError('Please provide all 4 multiple-choice options.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await adminApi.createAptitudeQuestion({
        category,
        topic,
        difficulty,
        question_text: questionText,
        options: [opt0, opt1, opt2, opt3],
        correct_option_index: correctIdx,
        explanation,
      });

      setSuccess('Question added to placement database successfully!');
      setQuestionText('');
      setTopic('');
      setOpt0('');
      setOpt1('');
      setOpt2('');
      setOpt3('');
      setExplanation('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create question.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Question Bank Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Curate and add validated screening questions to the official aptitude question repository.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-600" />
          <span>Add New Aptitude Question</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-none"
            >
              <option value="quantitative">Quantitative Aptitude</option>
              <option value="logical">Logical Reasoning</option>
              <option value="verbal">Verbal Ability</option>
              <option value="analytical">Analytical Reasoning</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Topic</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Permutations & Combinations"
              className="w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-none"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Question Statement</label>
          <textarea
            rows={3}
            required
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter the full question text..."
            className="w-full p-3 border rounded-xl text-xs focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Option A</label>
            <input
              type="text"
              required
              value={opt0}
              onChange={(e) => setOpt0(e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Option B</label>
            <input
              type="text"
              required
              value={opt1}
              onChange={(e) => setOpt1(e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Option C</label>
            <input
              type="text"
              required
              value={opt2}
              onChange={(e) => setOpt2(e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Option D</label>
            <input
              type="text"
              required
              value={opt3}
              onChange={(e) => setOpt3(e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Correct Option</label>
            <select
              value={correctIdx}
              onChange={(e) => setCorrectIdx(parseInt(e.target.value))}
              className="w-full px-3 py-1.5 border rounded-lg text-xs"
            >
              <option value={0}>Option A</option>
              <option value={1}>Option B</option>
              <option value={2}>Option C</option>
              <option value={3}>Option D</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Detailed Explanation & Working</label>
          <textarea
            rows={3}
            required
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Step-by-step mathematical or logical solution shown during post-test review..."
            className="w-full p-3 border rounded-xl text-xs focus:outline-none"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Add Question'}
          </button>
        </div>
      </form>
    </div>
  );
};
