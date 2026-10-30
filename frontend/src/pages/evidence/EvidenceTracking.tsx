import React, { useState, useEffect } from 'react';
import { evidenceApi } from '../../services/api';
import { EvidenceSummary, EvidenceClaim } from '../../types';
import {
  SearchCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  FileText,
  Code2,
  Mic,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

export const EvidenceTracking: React.FC = () => {
  const [summary, setSummary] = useState<EvidenceSummary | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clarifyingId, setClarifyingId] = useState<string | null>(null);
  const [clarificationText, setClarificationText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const data = await evidenceApi.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load evidence summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClarify = async (followUpId: string) => {
    if (!clarificationText.trim() || submitting) return;
    setSubmitting(true);
    try {
      await evidenceApi.clarifyFollowUp(followUpId, clarificationText);
      setClarifyingId(null);
      setClarificationText('');
      setSuccessToast('Candidate clarification recorded! Evidence trail updated.');
      setTimeout(() => setSuccessToast(null), 4000);
      await fetchSummary();
    } catch (err) {
      console.error('Failed to submit clarification:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Supported by available evidence':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
          color: 'text-emerald-600'
        };
      case 'Needs clarification':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: HelpCircle,
          color: 'text-amber-600'
        };
      case 'Potentially inconsistent':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: AlertCircle,
          color: 'text-purple-600'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: Clock,
          color: 'text-slate-500'
        };
    }
  };

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType.toLowerCase()) {
      case 'resume': return FileText;
      case 'coding': return Code2;
      case 'technical_interview': return Mic;
      case 'project_defense': return ShieldCheck;
      default: return FileText;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredClaims = summary?.claims.filter((c) => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  }) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Evidence Traceability & Verification Engine</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">
          Cross-Round Evidence Traceability & Adaptive Follow-Up Engine
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 max-w-3xl leading-relaxed">
          Connects candidate qualifications across resume claims, project documents, coding test artifacts, and interview viva transcripts. Clarifying inquiries are formulated respectfully without false accusations.
        </p>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-semibold text-slate-500 uppercase">Health Score</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{summary?.consistency_health_score || 0}%</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-semibold text-slate-500 uppercase">Total Claims</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{summary?.total_claims || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-semibold text-emerald-600 uppercase">Supported</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">{summary?.supported_count || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-semibold text-amber-600 uppercase">Needs Clarify</div>
          <div className="text-xl font-bold text-amber-700 mt-1">{summary?.needs_clarification_count || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-semibold text-slate-500 uppercase">Not Verified</div>
          <div className="text-xl font-bold text-slate-700 mt-1">{summary?.not_verified_count || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-semibold text-rose-600 uppercase">Pending Inquiries</div>
          <div className="text-xl font-bold text-rose-700 mt-1">{summary?.pending_follow_ups || 0}</div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap gap-1.5 text-xs">
        {[
          { label: 'All Tracked Claims', val: 'all' },
          { label: 'Supported by available evidence', val: 'Supported by available evidence' },
          { label: 'Needs clarification', val: 'Needs clarification' },
          { label: 'Not verified from available sources', val: 'Not verified from available sources' },
          { label: 'Potentially inconsistent', val: 'Potentially inconsistent' },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setStatusFilter(tab.val)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === tab.val
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {filteredClaims.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border p-8 text-xs text-slate-500">
            No claims found under this status filter.
          </div>
        ) : (
          filteredClaims.map((claim) => {
            const badge = getStatusBadge(claim.status);
            const StatusIcon = badge.icon;
            const SourceIcon = getSourceIcon(claim.source_type);

            return (
              <div
                key={claim.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4 transition-all"
              >
                {/* Claim Card Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-slate-100 text-slate-600">
                      <SourceIcon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                      Origin: {claim.source_type.replace('_', ' ')}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-mono truncate max-w-xs">{claim.source_reference}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Confidence: {(claim.confidence_score * 100).toFixed(0)}%</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${badge.color}`} />
                      <span>{claim.status}</span>
                    </span>
                  </div>
                </div>

                {/* Claim Text */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">"{claim.claim_text}"</h3>
                </div>

                {/* Supporting Excerpt & Rationale */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <strong className="text-slate-800 block mb-1">Supporting Document Excerpt:</strong>
                    <p className="text-slate-600 leading-relaxed italic">{claim.supporting_evidence}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <strong className="text-slate-800 block mb-1">Engine Analysis & Rationale:</strong>
                    <p className="text-slate-600 leading-relaxed">{claim.reasoning}</p>
                  </div>
                </div>

                {/* Follow-Up Inquiries Section */}
                {claim.follow_ups.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Adaptive Clarification Inquiries</span>
                    </div>

                    {claim.follow_ups.map((fu) => (
                      <div key={fu.id} className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 text-xs space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <p className="font-semibold text-indigo-950 leading-relaxed">
                            {fu.question_text}
                          </p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase flex-shrink-0 ${
                            fu.status === 'clarified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {fu.status}
                          </span>
                        </div>

                        {fu.student_clarification ? (
                          <div className="bg-white p-3 rounded-lg border border-indigo-100 text-slate-700">
                            <strong className="text-slate-900 block text-[11px] mb-0.5">Recorded Candidate Clarification:</strong>
                            <p className="leading-relaxed">{fu.student_clarification}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">Answered on: {new Date(fu.answered_at || fu.created_at).toLocaleString()}</span>
                          </div>
                        ) : (
                          <div>
                            {clarifyingId === fu.id ? (
                              <div className="space-y-2 mt-2">
                                <textarea
                                  rows={3}
                                  value={clarificationText}
                                  onChange={(e) => setClarificationText(e.target.value)}
                                  placeholder="Provide clarifying context, implementation nuances, or project architecture details..."
                                  className="w-full p-2.5 bg-white border border-indigo-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setClarifyingId(null)}
                                    className="px-3 py-1 rounded-md text-xs text-slate-600 hover:bg-slate-200"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleClarify(fu.id)}
                                    disabled={submitting}
                                    className="px-4 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold"
                                  >
                                    {submitting ? 'Recording...' : 'Submit Clarification'}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setClarifyingId(fu.id);
                                  setClarificationText('');
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-xs"
                              >
                                <Send className="w-3 h-3" />
                                <span>Answer & Clarify Claim</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
