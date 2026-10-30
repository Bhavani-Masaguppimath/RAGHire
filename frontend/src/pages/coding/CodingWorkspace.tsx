import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { codingApi } from '../../services/api';
import { CodingProblem, ExecutionResult } from '../../types';
import {
  Code2,
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  ShieldCheck,
  ArrowLeft,
  Terminal,
  FileCode
} from 'lucide-react';

export const CodingWorkspace: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [language, setLanguage] = useState<'python' | 'java'>('python');
  const [sourceCode, setSourceCode] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'output' | 'customInput'>('output');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!problemId) return;
      try {
        const data = await codingApi.getProblemDetail(problemId);
        setProblem(data);
        setSourceCode(language === 'python' ? data.python_starter_code : data.java_starter_code);
        setCustomInput(data.sample_input || '');
      } catch (err) {
        console.error('Failed to load problem:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [problemId]);

  const handleLanguageChange = (newLang: 'python' | 'java') => {
    setLanguage(newLang);
    if (problem) {
      setSourceCode(newLang === 'python' ? problem.python_starter_code : problem.java_starter_code);
    }
  };

  const resetCode = () => {
    if (problem) {
      setSourceCode(language === 'python' ? problem.python_starter_code : problem.java_starter_code);
    }
  };

  const handleRunCode = async () => {
    if (!problem || isRunning) return;
    setIsRunning(true);
    setActiveTab('output');
    try {
      const res = await codingApi.runCode(problem.id, language, sourceCode, customInput);
      setExecutionResult(res);
    } catch (err) {
      console.error('Failed to run code:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!problem || isSubmitting) return;
    setIsSubmitting(true);
    setActiveTab('output');
    try {
      const res = await codingApi.submitCode(problem.id, language, sourceCode);
      setExecutionResult(res);
    } catch (err) {
      console.error('Failed to submit code:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border p-8">
        <p className="text-sm text-slate-600 mb-4">Problem not found.</p>
        <Link to="/coding" className="text-xs font-semibold text-indigo-600">Back to Problems</Link>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-3">
      {/* Workspace Top Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-2.5 shadow-xs flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/coding" className="p-1 rounded-md hover:bg-slate-100 text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span>{problem.title}</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-indigo-50 text-indigo-700 uppercase border border-indigo-100">
                {problem.difficulty}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => handleLanguageChange('python')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                language === 'python' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Python 3.10
            </button>
            <button
              onClick={() => handleLanguageChange('java')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                language === 'java' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Java (OpenJDK 17)
            </button>
          </div>

          <button
            onClick={resetCode}
            title="Reset Starter Code"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Action Buttons */}
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-slate-600" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit Solution'}</span>
          </button>
        </div>
      </div>

      {/* Split Workspace Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0 overflow-hidden">
        {/* Left Pane: Problem Description */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs overflow-y-auto space-y-5">
          <div>
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">{problem.topic}</span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">{problem.title}</h2>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Problem Statement</h3>
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {problem.description}
            </div>
          </div>

          {problem.constraints && (
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Constraints</h3>
              <pre className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                {problem.constraints}
              </pre>
            </div>
          )}

          {problem.sample_input && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sample Test Case</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Sample Input</span>
                  <pre className="mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800">
                    {problem.sample_input}
                  </pre>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Expected Output</span>
                  <pre className="mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800">
                    {problem.sample_output}
                  </pre>
                </div>
              </div>
              {problem.sample_explanation && (
                <p className="text-xs text-slate-500 italic mt-1">
                  <strong>Explanation:</strong> {problem.sample_explanation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Pane: Monaco Editor & Output Console */}
        <div className="flex flex-col h-full rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs bg-slate-900">
          {/* Monaco Editor Section */}
          <div className="flex-1 min-h-[300px]">
            <Editor
              height="100%"
              language={language === 'python' ? 'python' : 'java'}
              theme="vs-dark"
              value={sourceCode}
              onChange={(value) => setSourceCode(value || '')}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                automaticLayout: true,
              }}
            />
          </div>

          {/* Bottom Execution Console */}
          <div className="h-48 border-t border-slate-800 bg-slate-950 flex flex-col flex-shrink-0">
            {/* Console Tab Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('output')}
                  className={`flex items-center gap-1.5 transition-colors ${
                    activeTab === 'output' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Execution Output</span>
                </button>
                <button
                  onClick={() => setActiveTab('customInput')}
                  className={`flex items-center gap-1.5 transition-colors ${
                    activeTab === 'customInput' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Custom Stdin</span>
                </button>
              </div>

              {executionResult && (
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{executionResult.runtime_ms}ms</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-slate-500" />
                    <span>{executionResult.memory_kb}KB</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{executionResult.provider}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Console Content */}
            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-300">
              {activeTab === 'customInput' ? (
                <textarea
                  rows={4}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter custom standard input..."
                  className="w-full h-full bg-transparent border-0 text-slate-200 focus:outline-none resize-none"
                />
              ) : executionResult ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {executionResult.status === 'ACCEPTED' ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>ACCEPTED ({executionResult.test_cases_passed}/{executionResult.total_test_cases} Passed)</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-400 font-bold">
                        <XCircle className="w-4 h-4" />
                        <span>{executionResult.status} ({executionResult.test_cases_passed}/{executionResult.total_test_cases} Passed)</span>
                      </span>
                    )}
                  </div>

                  {executionResult.stdout && (
                    <div>
                      <span className="text-slate-500 text-[10px] block">Standard Output:</span>
                      <pre className="text-slate-200 whitespace-pre-wrap">{executionResult.stdout}</pre>
                    </div>
                  )}

                  {executionResult.stderr && (
                    <div>
                      <span className="text-rose-400 text-[10px] block">Error Log:</span>
                      <pre className="text-rose-300 whitespace-pre-wrap">{executionResult.stderr}</pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-600 italic">
                  Click 'Run Code' or 'Submit Solution' to execute your code in the isolated sandbox.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
