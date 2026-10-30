import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/api';
import {
  BarChart3,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Award,
  GraduationCap,
  ShieldCheck,
  FileCheck2
} from 'lucide-react';

export const PerformanceReports: React.FC = () => {
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await analyticsApi.getComprehensiveReport();
        setReport(data);
      } catch (err) {
        console.error('Failed to load performance report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Placement Assessment Report</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive multi-round readiness dossier for campus placements.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Export / Print Report</span>
        </button>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">RAGHire Placement Evaluation Dossier</div>
              <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">
                Comprehensive Candidate Placement Competency Assessment
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500">
            <div>Report Date: {new Date().toLocaleDateString()}</div>
            <div className="font-mono text-[11px] text-slate-400">ID: RAGH-{report.candidate.name.replace(' ', '').toUpperCase()}</div>
          </div>
        </div>

        {/* Candidate Profile Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Candidate Name</span>
            <div className="font-bold text-slate-900 mt-0.5">{report.candidate.name}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Target Job Role</span>
            <div className="font-bold text-slate-900 mt-0.5">{report.candidate.target_role}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Degree & Batch</span>
            <div className="font-bold text-slate-900 mt-0.5">{report.candidate.degree} ({report.candidate.graduation_year})</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Readiness Score</span>
            <div className="font-bold text-indigo-600 text-sm mt-0.5">{report.metrics.placement_readiness_score}%</div>
          </div>
        </div>

        {/* Multi-Round Evaluation Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Evaluation by Campus Screening Rounds
          </h3>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-3 font-semibold">Recruitment Round</th>
                  <th className="p-3 font-semibold">Assessment Mechanism</th>
                  <th className="p-3 font-semibold">Candidate Score</th>
                  <th className="p-3 font-semibold">Benchmark</th>
                  <th className="p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {report.round_evaluations.map((r: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{r.round}</td>
                    <td className="p-3 text-slate-500">{r.evaluation_type}</td>
                    <td className="p-3 font-bold text-indigo-600">{r.score}</td>
                    <td className="p-3 text-slate-500">{r.benchmark}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        r.status === 'PASS' || r.status === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Insights & Next Steps */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Key Recommendations for Placement Committee Review
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <strong className="text-slate-900 block font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Strengths</span>
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Candidate demonstrated strong problem-solving in array data structures and articulated distributed caching architecture convincingly during project defense.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <strong className="text-slate-900 block font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Recommended Focus Areas</span>
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Revise quantitative calculations on work and time to boost screening speed; explicitly state algorithmic time complexities in viva answers.
              </p>
            </div>
          </div>
        </div>

        {/* Methodological Transparency & Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
          <strong className="text-slate-700 block mb-1">Academic & Methodological Disclaimer:</strong>
          {report.disclaimer}
        </div>
      </div>
    </div>
  );
};
