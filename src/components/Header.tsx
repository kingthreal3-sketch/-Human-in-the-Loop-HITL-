import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  PlusCircle, 
  Clock, 
  Workflow, 
  Inbox, 
  Database, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { ReviewerProfile, WorkflowRun } from '../types';
import { REVIEWER_PROFILES } from '../data/seedData';

interface HeaderProps {
  activeTab: 'pipeline' | 'queue' | 'golden' | 'policy';
  setActiveTab: (tab: 'pipeline' | 'queue' | 'golden' | 'policy') => void;
  pendingRunsCount: number;
  currentReviewer: ReviewerProfile;
  setCurrentReviewer: (reviewer: ReviewerProfile) => void;
  onOpenTriggerModal: () => void;
  workflowRuns: WorkflowRun[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingRunsCount,
  currentReviewer,
  setCurrentReviewer,
  onOpenTriggerModal,
  workflowRuns,
}) => {
  const highRiskCount = workflowRuns.filter(
    r => r.status === 'AWAITING_REVIEW' && r.riskAssessment.tier === 'HIGH'
  ).length;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">LoopGuard</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  HITL Engine
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono hidden sm:inline-block">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                Human-in-the-Loop Content Generation & Quality Control Studio
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Pipeline & Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                activeTab === 'queue'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Review Station</span>
              {pendingRunsCount > 0 && (
                <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                  {pendingRunsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('golden')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'golden'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="flex items-center gap-1">
                <span>Golden Dataset</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/20">
                  19%
                </span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('policy')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'policy'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Risk Engine</span>
            </button>
          </nav>

          {/* Right Area: Reviewer Identity & Trigger Button */}
          <div className="flex items-center gap-3">
            {/* Reviewer Persona Switcher */}
            <div className="relative group hidden sm:block">
              <label htmlFor="reviewer-select" className="sr-only">Switch Active Reviewer</label>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                <img
                  src={currentReviewer.avatar}
                  alt={currentReviewer.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-indigo-400"
                />
                <div className="text-left leading-tight">
                  <span className="block font-medium text-slate-200 truncate max-w-[110px]">
                    {currentReviewer.name.split(' ')[0]} ({currentReviewer.department})
                  </span>
                </div>
                <select
                  id="reviewer-select"
                  aria-label="Switch Active Reviewer"
                  value={currentReviewer.id}
                  onChange={(e) => {
                    const found = REVIEWER_PROFILES.find(r => r.id === e.target.value);
                    if (found) setCurrentReviewer(found);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                >
                  {REVIEWER_PROFILES.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name} - {p.role} ({p.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trigger Button */}
            <button
              onClick={onOpenTriggerModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Trigger New Run</span>
              <span className="sm:hidden">Trigger</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
