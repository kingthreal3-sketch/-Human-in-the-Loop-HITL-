import React, { useState } from 'react';
import { 
  Zap, 
  Bot, 
  ShieldAlert, 
  PauseCircle, 
  UserCheck, 
  RefreshCw, 
  Send, 
  Database, 
  ArrowRight, 
  Info, 
  Sparkles,
  FileCheck2,
  Lock,
  GitBranch,
  Layers,
  ChevronRight
} from 'lucide-react';
import { WorkflowRun } from '../types';

interface WorkflowVisualizerProps {
  currentRun?: WorkflowRun;
  allRuns: WorkflowRun[];
  onSelectRun: (run: WorkflowRun) => void;
  onOpenTriggerModal: () => void;
}

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  currentRun,
  allRuns,
  onSelectRun,
  onOpenTriggerModal,
}) => {
  const [activeStepInfo, setActiveStepInfo] = useState<number | null>(null);

  const pendingCount = allRuns.filter(r => r.status === 'AWAITING_REVIEW').length;
  const inRevisionCount = allRuns.filter(r => r.status === 'IN_REVISION').length;
  const approvedCount = allRuns.filter(r => r.status === 'APPROVED' || r.status === 'DISPATCHED').length;

  const currentStatus = currentRun?.status || 'AWAITING_REVIEW';

  const steps = [
    {
      num: 1,
      id: 'trigger',
      title: 'Inbound Trigger',
      subtitle: 'Webhook / Email / CRM',
      icon: Zap,
      color: 'from-amber-500 to-amber-600',
      badge: 'Step 1',
      activeOn: ['TRIGGERED'],
      description: 'Incoming customer ticket, marketing schedule, or enterprise prompt initiates the workflow with full operational context.',
      details: [
        'Context payload serialized',
        'Brand tone guidelines attached',
        'Regulatory constraints injected'
      ]
    },
    {
      num: 2,
      id: 'ai_gen',
      title: 'AI Draft & Risk Score',
      subtitle: 'Gemini 3.8 Flash Agent',
      icon: Bot,
      color: 'from-indigo-500 to-indigo-600',
      badge: 'Step 2',
      activeOn: ['GENERATING'],
      description: 'Gemini generates initial draft alongside reasoning chain, source citations, policy checklist, and risk tiering.',
      details: [
        'System prompt constraints evaluated',
        'Automated policy checks executed',
        'Risk score (0-100) computed'
      ]
    },
    {
      num: 3,
      id: 'pause',
      title: 'Pause & Interruption Token',
      subtitle: 'AWS Step Functions / n8n',
      icon: PauseCircle,
      color: 'from-sky-500 to-sky-600',
      badge: 'Step 3',
      activeOn: ['AWAITING_REVIEW'],
      count: pendingCount,
      description: 'Workflow execution serializes state and pauses asynchronously. Dispatches task token to reviewer via Slack / Email.',
      details: [
        'Task token: itok_stepfn_... issued',
        'Non-blocking async wait state',
        'SLA timeout countdown activated'
      ]
    },
    {
      num: 4,
      id: 'review',
      title: 'Human Review & Diff',
      subtitle: 'Sufficient Decision Info',
      icon: UserCheck,
      color: 'from-violet-500 to-violet-600',
      badge: 'Step 4',
      activeOn: ['AWAITING_REVIEW'],
      description: 'Reviewer inspects original trigger context, side-by-side visual word diff, AI reasoning, and exercises human override authority.',
      details: [
        'Side-by-side live diff viewer',
        'In-place text editing & quick snippets',
        'Anti-rubber-stamp decision deck'
      ]
    },
    {
      num: 5,
      id: 'revision_loop',
      title: 'Revision Loop',
      subtitle: 'Generate-Revise-Regenerate',
      icon: RefreshCw,
      color: 'from-rose-500 to-rose-600',
      badge: 'Iterative Loop',
      activeOn: ['IN_REVISION'],
      count: inRevisionCount,
      description: 'Rejection is not termination! Human critique is fed back into Gemini to regenerate calibrated versions (v1 → v2 → v3).',
      details: [
        'Structured reviewer feedback injection',
        'Delta changelog generation',
        'Multi-turn alignment until approved'
      ]
    },
    {
      num: 6,
      id: 'dispatch',
      title: 'Sign & Dispatch',
      subtitle: 'External Release & Audit',
      icon: Send,
      color: 'from-emerald-500 to-emerald-600',
      badge: 'Step 5',
      activeOn: ['APPROVED', 'DISPATCHED'],
      count: approvedCount,
      description: 'Reviewer affixes digital signature and compliance hash. Resumes workflow execution to dispatch email, social, or CRM.',
      details: [
        'Cryptographic audit signature',
        'Multi-channel API emission',
        'Event-sourced immutable log'
      ]
    },
    {
      num: 7,
      id: 'golden',
      title: 'Golden Dataset Loop',
      subtitle: 'The 19% Optimization Set',
      icon: Database,
      color: 'from-amber-400 to-amber-600',
      badge: 'Continuous Learning',
      activeOn: ['APPROVED', 'DISPATCHED'],
      description: 'Captures the 19% of drafts corrected by humans as golden training pairs for prompt auto-tuning and model distillation.',
      details: [
        'Diff patch & error taxonomy logging',
        'Auto-synthesized prompt guardrails',
        'Exportable JSONL fine-tuning data'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Thesis Statement */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/70 border border-indigo-500/20 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Core Architecture: Asynchronous Human Approval Checkpoint</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Human-in-the-Loop Content Generation & Quality Control Studio
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Inserting a mandatory, meaningful human approval checkpoint before AI-generated content is published externally. 
              Treating human review not just as safety, but as an <strong className="text-amber-300 font-medium">asynchronous data source and quality control loop</strong> to optimize enterprise models over time.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-200 font-semibold">81%</span> Direct Pass Baseline
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-amber-300 font-semibold">19%</span> Human Correction Golden Set
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-indigo-400" />
                <span>Zero Rubber-Stamp Decision Deck</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenTriggerModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 whitespace-nowrap"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Simulate Trigger Run</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Interactive Flow */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              <span>End-to-End HITL Execution Flowchart</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any stage below to inspect its asynchronous state, token mechanics, and decision criteria.
            </p>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Active Stage</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              <span>Completed / Pending</span>
            </span>
          </div>
        </div>

        {/* Steps Grid / Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrentActive = currentRun && step.activeOn.includes(currentRun.status);
            const isSelected = activeStepInfo === step.num;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStepInfo(isSelected ? null : step.num)}
                className={`relative flex flex-col justify-between p-3.5 rounded-xl border transition-all cursor-pointer group ${
                  isCurrentActive
                    ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-500/80 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                    : isSelected
                    ? 'bg-slate-800/90 border-slate-600'
                    : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Arrow Connector on desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden xl:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-500 transition-colors" />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {step.badge}
                    </span>
                    {typeof step.count === 'number' && step.count > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {step.count} active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${step.color} shadow-sm text-white`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-indigo-400 font-medium group-hover:underline">
                    {isSelected ? 'Hide details' : 'Inspect step'}
                  </span>
                  {isCurrentActive && (
                    <span className="text-emerald-400 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Active Run
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Drawer / Deep Dive Info */}
        {activeStepInfo && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs animate-in fade-in slide-in-from-top-2">
            {(() => {
              const step = steps.find(s => s.num === activeStepInfo);
              if (!step) return null;
              return (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{step.title}</span>
                      <span className="text-slate-400 font-normal">({step.subtitle})</span>
                    </div>
                    <p className="text-slate-300 max-w-2xl">{step.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {step.details.map((d, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
                        ✓ {d}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Current Run Active Context Card */}
      {currentRun && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl border mt-0.5 ${
                currentRun.riskAssessment.tier === 'HIGH'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : currentRun.riskAssessment.tier === 'MEDIUM'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    Token: {currentRun.taskToken}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    currentRun.status === 'AWAITING_REVIEW'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : currentRun.status === 'IN_REVISION'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {currentRun.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400">
                    Assigned: <strong className="text-slate-200">{currentRun.assignedReviewer.name}</strong> ({currentRun.assignedReviewer.role})
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {currentRun.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Trigger: <span className="text-slate-300">{currentRun.triggerSource}</span> • Target: <span className="text-slate-300 capitalize">{currentRun.channel.replace('_', ' ')}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <button
                onClick={() => onSelectRun(currentRun)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/20"
              >
                <span>Enter Review Station</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Architecture Highlights & 3 Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mb-3">
            <PauseCircle className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white mb-1">
            1. Asynchronous Waiting & State Persistence
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Content reviewers aren’t sitting waiting at the screen. LoopGuard serializes state and emits an AWS Step Functions callback token, letting reviewers pick up items hours later via Slack or Email.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3">
            <UserCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white mb-1">
            2. "Sufficient Decision Info" Against Rubber-Stamping
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Approval isn’t just an Agree button. Reviewers see the original customer brief, side-by-side live diffs, AI reasoning chain, and risk tiering to make informed editorial decisions.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-3">
            <Database className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white mb-1">
            3. The 19% Golden Dataset Closed Loop
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            When humans correct the 19% of AI drafts that need adjustment, those corrections are logged as golden fine-tuning pairs. Gemini synthesizes new prompt guardrails to permanently prevent repeat mistakes.
          </p>
        </div>
      </div>
    </div>
  );
};
