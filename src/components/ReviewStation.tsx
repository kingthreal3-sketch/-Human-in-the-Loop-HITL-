import React, { useState, useEffect } from 'react';
import { 
  WorkflowRun, 
  ReviewerProfile, 
  CorrectionCategory 
} from '../types';
import { computeWordDiff, computeDiffStats } from '../utils/diff';
import { 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  XCircle, 
  FileEdit, 
  Split, 
  Eye, 
  Sparkles, 
  Clock, 
  FileText, 
  Bell, 
  History, 
  Lock, 
  AlertTriangle,
  ChevronDown,
  Info,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

interface ReviewStationProps {
  run: WorkflowRun;
  currentReviewer: ReviewerProfile;
  onApproveAndDispatch: (runId: string, finalDraft: string, finalHeadline: string, notes: string, category?: CorrectionCategory) => void;
  onRequestRevision: (runId: string, feedback: string) => Promise<void>;
  onRejectRun: (runId: string, reason: string) => void;
  onOpenAuditModal: () => void;
  onOpenNotificationModal: () => void;
  isRevising: boolean;
}

export const ReviewStation: React.FC<ReviewStationProps> = ({
  run,
  currentReviewer,
  onApproveAndDispatch,
  onRequestRevision,
  onRejectRun,
  onOpenAuditModal,
  onOpenNotificationModal,
  isRevising,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'diff' | 'channel_preview'>('editor');
  const [editableDraft, setEditableDraft] = useState<string>(run.currentDraft);
  const [editableHeadline, setEditableHeadline] = useState<string>(run.currentHeadline);
  
  // Revision modal state
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState<boolean>(false);
  const [revisionFeedback, setRevisionFeedback] = useState<string>('');
  
  // Approval modal state
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState<boolean>(false);
  const [signOffNotes, setSignOffNotes] = useState<string>('');
  const [selectedCorrectionCategory, setSelectedCorrectionCategory] = useState<CorrectionCategory>('Tone Calibration');

  // Selected version view
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number>(run.versions.length - 1);
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);

  // Sync state when selected run changes or versions change
  useEffect(() => {
    setEditableDraft(run.currentDraft);
    setEditableHeadline(run.currentHeadline);
    setSelectedVersionIndex(run.versions.length - 1);
  }, [run.id, run.currentDraft, run.currentHeadline, run.versions.length]);

  const originalAIDraft = run.versions[0]?.draft || '';
  const diffStats = computeDiffStats(originalAIDraft, editableDraft);
  const isHumanModified = !diffStats.isIdentical;

  const currentVersionData = run.versions[selectedVersionIndex] || run.versions[run.versions.length - 1];

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(editableDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleInsertSnippet = (snippet: string) => {
    setEditableDraft(prev => prev + '\n\n' + snippet);
  };

  const handleConfirmApproval = () => {
    onApproveAndDispatch(
      run.id,
      editableDraft,
      editableHeadline,
      signOffNotes || 'Approved with verified human oversight.',
      isHumanModified ? selectedCorrectionCategory : undefined
    );
    setIsApprovalModalOpen(false);
  };

  const handleConfirmRevision = async () => {
    if (!revisionFeedback.trim()) return;
    await onRequestRevision(run.id, revisionFeedback);
    setIsRevisionModalOpen(false);
    setRevisionFeedback('');
  };

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
      {/* 1. Header Bar: Task Token, Pause Status & SLA */}
      <div className="border-b border-slate-800 bg-slate-950/80 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-mono font-bold text-xs">
            HITL
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-semibold text-slate-200">
                {run.taskToken}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
                <Clock className="w-3 h-3 animate-spin" />
                <span>Async Interruption: Paused for Human</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                run.riskAssessment.tier === 'HIGH'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {run.riskAssessment.tier} RISK ({run.riskAssessment.score}/100)
              </span>
            </div>
            <h2 className="text-sm font-bold text-white mt-0.5">
              {run.title}
            </h2>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={onOpenNotificationModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            title="Inspect Slack Block Kit & Email notification dispatched to reviewer"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Inspect Notification</span>
          </button>

          <button
            onClick={onOpenAuditModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Split / Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-[560px]">
        
        {/* Left Column (5 cols): "Sufficient Decision Information" Context Deck */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/50 p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[750px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Decision Context Deck</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Source: {run.channel}
              </span>
            </div>

            {/* Trigger Brief Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                  Original Inbound Trigger
                </span>
                <p className="text-xs font-medium text-slate-200 mt-0.5">
                  {run.triggerSource}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                  Target Audience
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  {run.targetAudience}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                  Background Context
                </span>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                  {run.context}
                </p>
              </div>
            </div>
          </div>

          {/* Editorial & Compliance Constraints */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Mandatory Constraints & Brand Voice</span>
            </span>
            <div className="text-xs text-slate-300 space-y-1.5">
              <div>
                <span className="text-slate-500">Tone:</span> <span className="text-slate-200 font-medium">{run.brandTone}</span>
              </div>
              <div>
                <span className="text-slate-500">Must include:</span> <span className="text-slate-300">{run.constraints}</span>
              </div>
            </div>
          </div>

          {/* AI Reasoning & Citations */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>AI Model Reasoning & Citations</span>
            </span>
            
            <p className="text-xs text-slate-300 italic bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-500/20 leading-relaxed">
              "{currentVersionData.reasoning}"
            </p>

            {currentVersionData.citations && currentVersionData.citations.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                  Cited Policies & Standards
                </span>
                <ul className="space-y-1 text-xs text-slate-400">
                  {currentVersionData.citations.map((cite, i) => (
                    <li key={i} className="flex items-start gap-1.5 font-mono text-[11px] text-slate-300">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span>{cite}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Policy Compliance Checks */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide flex items-center justify-between">
              <span>Automated Policy Checklist</span>
              <span className="text-[10px] text-emerald-400 font-bold">
                {run.policyChecks.filter(p => p.passed).length}/{run.policyChecks.length} Passed
              </span>
            </span>
            <div className="space-y-1.5">
              {run.policyChecks.map((check, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs p-1.5 rounded bg-slate-950/50">
                  {check.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className={`font-medium ${check.passed ? 'text-slate-300' : 'text-amber-300'}`}>
                      {check.rule}
                    </span>
                    <p className="text-[11px] text-slate-500">{check.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Interactive Reviewer Terminal & Diff Studio */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-slate-900/40 p-4 sm:p-6 space-y-4">
          
          {/* Top Bar inside Terminal: View Mode Switcher & Versions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'editor'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Reviewer Live Editor</span>
              </button>

              <button
                onClick={() => setActiveTab('diff')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'diff'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span>Side-by-Side Word Diff</span>
                {isHumanModified && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('channel_preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'channel_preview'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Channel Preview</span>
              </button>
            </div>

            {/* Version Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Draft Version:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                {run.versions.map((v, i) => (
                  <button
                    key={v.versionNumber}
                    onClick={() => {
                      setSelectedVersionIndex(i);
                      setEditableDraft(v.draft);
                      setEditableHeadline(v.headline);
                    }}
                    className={`px-2 py-1 rounded text-xs font-mono font-medium ${
                      selectedVersionIndex === i
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    v{v.versionNumber}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Snippet Injectors (Human Override Accelerator) */}
          {activeTab === 'editor' && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 text-[11px] font-medium">Quick Overrides:</span>
              <button
                onClick={() => handleInsertSnippet("⚠️ MANDATORY DISCLAIMER: Subject to formal underwriting approval and terms of service clause 12.4.")}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-[11px] transition-colors"
              >
                + Regulatory Disclaimer
              </button>
              <button
                onClick={() => handleInsertSnippet("For urgent inquiries, please contact our designated senior response desk at +1 (800) 555-0199.")}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-[11px] transition-colors"
              >
                + Dedicated Escalation Hotline
              </button>
              <button
                onClick={() => handleInsertSnippet("Goodwill Voucher: [VIP-CREDIT-2026] (Valid for 90 days across primary subscriptions).")}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-[11px] transition-colors"
              >
                + 90-Day Goodwill Code
              </button>
              <button
                onClick={handleCopyDraft}
                className="ml-auto text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px]"
              >
                {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDraft ? 'Copied' : 'Copy Draft'}</span>
              </button>
            </div>
          )}

          {/* View Tab Body */}
          <div className="flex-1 min-h-[360px] flex flex-col">
            
            {/* Tab A: Reviewer Live Editor */}
            {activeTab === 'editor' && (
              <div className="space-y-3 flex-1 flex flex-col">
                <div>
                  <label htmlFor="headline-input" className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    Subject Line / Headline
                  </label>
                  <input
                    id="headline-input"
                    type="text"
                    value={editableHeadline}
                    onChange={(e) => setEditableHeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="draft-textarea" className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                      Draft Body (Full In-Place Human Override)
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      {editableDraft.length} chars • {editableDraft.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    id="draft-textarea"
                    rows={12}
                    value={editableDraft}
                    onChange={(e) => setEditableDraft(e.target.value)}
                    className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500 resize-y"
                    placeholder="Reviewer can modify every sentence directly..."
                  />
                </div>

                {/* Diff Delta Bar */}
                <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isHumanModified ? 'bg-amber-400' : 'bg-slate-600'}`}></span>
                    <span className="text-slate-300">
                      {diffStats.summary}
                    </span>
                  </div>
                  {isHumanModified && (
                    <span className="text-amber-400 font-semibold text-[11px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Eligible for 19% Golden Dataset
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Tab B: Side-by-Side Word Diff */}
            {activeTab === 'diff' && (
              <div className="space-y-3 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                        + Added
                      </span>
                      <span>Reviewer Additions</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold line-through border border-rose-500/30">
                        - Removed
                      </span>
                      <span>AI Draft Deletions</span>
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-300">
                    +{diffStats.addedWords}w / -{diffStats.removedWords}w
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                  {/* Left: Original AI Draft */}
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>Original AI Generation (v1)</span>
                    </span>
                    <div className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed flex-1 overflow-y-auto max-h-[420px]">
                      {originalAIDraft}
                    </div>
                  </div>

                  {/* Right: Real-time Word Diff */}
                  <div className="bg-slate-950 rounded-xl p-4 border border-indigo-500/30 flex flex-col">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FileEdit className="w-3 h-3 text-emerald-400" />
                      <span>Reviewer Corrected Output (Live Diff)</span>
                    </span>
                    <div className="text-xs font-mono whitespace-pre-wrap leading-relaxed flex-1 overflow-y-auto max-h-[420px]">
                      {diffStats.parts.map((part, index) => {
                        if (part.added) {
                          return (
                            <span
                              key={index}
                              className="bg-emerald-500/30 text-emerald-200 px-0.5 py-0.5 rounded border-b-2 border-emerald-400 font-semibold"
                            >
                              {part.value}
                            </span>
                          );
                        }
                        if (part.removed) {
                          return (
                            <span
                              key={index}
                              className="bg-rose-500/20 text-rose-400 line-through px-0.5 py-0.5 rounded opacity-75"
                            >
                              {part.value}
                            </span>
                          );
                        }
                        return <span key={index} className="text-slate-300">{part.value}</span>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab C: Realistic Target Channel Preview */}
            {activeTab === 'channel_preview' && (
              <div className="flex-1 flex flex-col justify-center">
                {run.channel === 'email' || run.channel === 'support_ticket' ? (
                  <div className="bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-w-2xl mx-auto w-full">
                    <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-600">
                      <div>
                        <strong>To:</strong> {run.targetAudience}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Via LoopGuard Verified Outbound
                      </div>
                    </div>
                    <div className="px-6 py-4 border-b border-slate-100">
                      <h4 className="font-bold text-base text-slate-900">{editableHeadline}</h4>
                    </div>
                    <div className="p-6 text-sm text-slate-800 font-sans leading-relaxed whitespace-pre-wrap">
                      {editableDraft}
                    </div>
                    <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Verified by Human Signer: {currentReviewer.name}</span>
                      <span className="font-mono text-emerald-600 font-semibold">Ready for Dispatch</span>
                    </div>
                  </div>
                ) : run.channel === 'social_linkedin' || run.channel === 'social_x' ? (
                  <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-6 max-w-xl mx-auto w-full shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white">
                        LG
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>LoopGuard Official</span>
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px]">✓</span>
                        </div>
                        <div className="text-xs text-slate-400">@loopguard_ai • Enterprise Workflows</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed mb-4">
                      {editableDraft}
                    </p>
                    <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                      <span>External Audience: 48,000 Followers</span>
                      <span className="text-indigo-400 font-semibold">Post preview verified</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-6 max-w-2xl mx-auto w-full shadow-2xl space-y-3 font-serif">
                    <div className="border-b border-slate-800 pb-3 text-center">
                      <span className="text-[10px] tracking-widest uppercase font-mono text-amber-400">
                        OFFICIAL REGULATORY & LEGAL DISCLOSURE
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">{editableHeadline}</h3>
                    </div>
                    <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed py-2 font-mono">
                      {editableDraft}
                    </div>
                    <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Signer: {currentReviewer.name} ({currentReviewer.role})</span>
                      <span className="text-emerald-400">SOC-2 & AIA Compliance Hash Pending</span>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* 3. Bottom Action Bar: The Approval & Revision Gate */}
          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img
                src={currentReviewer.avatar}
                alt={currentReviewer.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/50"
              />
              <div className="text-xs">
                <span className="text-slate-400">Reviewing as: </span>
                <strong className="text-white">{currentReviewer.name}</strong>
                <span className="text-slate-500 block text-[10px]">{currentReviewer.role}</span>
              </div>
            </div>

            {/* Actions: Request Revision, Reject, Approve & Dispatch */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onRejectRun(run.id, 'Content did not meet enterprise safety or editorial criteria.')}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
              >
                Reject & Close
              </button>

              <button
                onClick={() => setIsRevisionModalOpen(true)}
                disabled={isRevising}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
                title="Feed reviewer critique back to Gemini to regenerate the draft (The Revision Loop)"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isRevising ? 'animate-spin' : ''}`} />
                <span>Request AI Revision</span>
              </button>

              <button
                onClick={() => setIsApprovalModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Approve & Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Request Revision Loop ("generate-revise-regenerate") */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">The Revision Loop</h3>
                  <p className="text-xs text-slate-400">Regenerate with structured feedback rather than terminating</p>
                </div>
              </div>
              <button
                onClick={() => setIsRevisionModalOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your feedback is fed directly back to the <strong>Gemini 3.8 Flash agent</strong> along with the previous draft to synthesize an aligned version (v{run.versions.length + 1}).
            </p>

            {/* Quick feedback suggestions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Quick Critiques:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Tone is too informal; make it legally rigorous and measured.",
                  "Acknowledge the customer's 3-year tenure and provide a 15% discount code.",
                  "Shorten by 35% and remove hyperbole or aggressive sales promises.",
                  "Insert mandatory EU AI Act Article 14 and HIPAA regulatory disclosures."
                ].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setRevisionFeedback(s)}
                    className="text-[11px] text-left px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
                  >
                    "{s}"
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="revision-feedback-input" className="block text-xs font-semibold text-slate-300 mb-1">
                Reviewer Critique & Revision Instructions:
              </label>
              <textarea
                id="revision-feedback-input"
                rows={4}
                value={revisionFeedback}
                onChange={(e) => setRevisionFeedback(e.target.value)}
                placeholder="Specify exact wording adjustments, tone corrections, or missing clauses..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsRevisionModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevision}
                disabled={!revisionFeedback.trim() || isRevising}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRevising ? 'Regenerating via Gemini...' : 'Regenerate Draft v' + (run.versions.length + 1)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Human Sign-Off & Golden Dataset Capture */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Cryptographic Human Sign-off</h3>
                  <p className="text-xs text-slate-400">Resuming workflow execution and publishing</p>
                </div>
              </div>
              <button
                onClick={() => setIsApprovalModalOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Authorized Signer:</span>
                <span className="text-white font-semibold">{currentReviewer.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Role & Department:</span>
                <span className="text-slate-300">{currentReviewer.role}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Interruption Token:</span>
                <span className="text-indigo-400">{run.taskToken}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Editorial Status:</span>
                <span className={isHumanModified ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                  {isHumanModified ? 'Human Modified (Override Applied)' : 'Direct Pass (Unaltered)'}
                </span>
              </div>
            </div>

            {/* If modified, tag the 19% Golden Dataset category */}
            {isHumanModified && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Log to the 19% Golden Dataset</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    Model Fine-Tuning
                  </span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  You modified the draft ({diffStats.addedWords} words added, {diffStats.removedWords} removed). Classify this correction so LoopGuard can train the AI to avoid this error in the future:
                </p>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {[
                    'Tone Calibration',
                    'Financial & Discount Guardrail',
                    'Missing Disclaimer',
                    'Factual Inaccuracy',
                    'Formatting & Brevity',
                    'Legal Liability'
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCorrectionCategory(cat as CorrectionCategory)}
                      className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                        selectedCorrectionCategory === cat
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="sign-off-notes-input" className="block text-xs font-semibold text-slate-300 mb-1">
                Sign-off Audit Note (Mandatory for SOC-2 / Legal Record):
              </label>
              <input
                id="sign-off-notes-input"
                type="text"
                value={signOffNotes}
                onChange={(e) => setSignOffNotes(e.target.value)}
                placeholder="e.g., Reviewed against Q4 refund policy; terms approved for release."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsApprovalModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={handleConfirmApproval}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-200" />
                <span>Affix Signature & Dispatch Content</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
