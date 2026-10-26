import React, { useState } from 'react';
import { 
  Inbox, 
  ShieldAlert, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  FileText, 
  ChevronRight, 
  User, 
  Sparkles,
  RefreshCw,
  Mail,
  Linkedin,
  Twitter,
  LifeBuoy,
  Scale
} from 'lucide-react';
import { WorkflowRun, ChannelType, RiskTier } from '../types';

interface ReviewQueueProps {
  runs: WorkflowRun[];
  selectedRunId: string;
  onSelectRun: (run: WorkflowRun) => void;
  onOpenTriggerModal: () => void;
}

export const ReviewQueue: React.FC<ReviewQueueProps> = ({
  runs,
  selectedRunId,
  onSelectRun,
  onOpenTriggerModal,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredRuns = runs.filter((run) => {
    if (filterStatus === 'pending' && run.status !== 'AWAITING_REVIEW') return false;
    if (filterStatus === 'revision' && run.status !== 'IN_REVISION') return false;
    if (filterStatus === 'approved' && run.status !== 'APPROVED' && run.status !== 'DISPATCHED') return false;
    if (riskFilter !== 'all' && run.riskAssessment.tier !== riskFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        run.title.toLowerCase().includes(q) ||
        run.triggerSource.toLowerCase().includes(q) ||
        run.taskToken.toLowerCase().includes(q) ||
        run.assignedReviewer.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getChannelIcon = (channel: ChannelType) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-blue-400" />;
      case 'social_linkedin':
        return <Linkedin className="w-3.5 h-3.5 text-sky-400" />;
      case 'social_x':
        return <Twitter className="w-3.5 h-3.5 text-indigo-400" />;
      case 'support_ticket':
        return <LifeBuoy className="w-3.5 h-3.5 text-emerald-400" />;
      case 'legal_notice':
        return <Scale className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getRiskBadge = (tier: RiskTier, score: number) => {
    switch (tier) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            HIGH RISK ({score})
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            MED RISK ({score})
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            LOW RISK ({score})
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-4">
      {/* Top Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-indigo-400" />
            <span>HITL Review Station Queue</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-normal">
              {filteredRuns.length} items
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Content waiting at the mandatory human checkpoint prior to external dispatch.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticket, token, reviewer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                filterStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                filterStatus === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Awaiting Review
            </button>
            <button
              onClick={() => setFilterStatus('revision')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                filterStatus === 'revision' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              In Revision
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                filterStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Approved
            </button>
          </div>

          <label htmlFor="risk-tier-select" className="sr-only">Filter by Risk Tier</label>
          <select
            id="risk-tier-select"
            aria-label="Filter by Risk Tier"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Risk Tiers</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Queue Items Table / List */}
      <div className="space-y-2.5">
        {filteredRuns.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
            <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-300">No items match your filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All pending human reviews are clear, or no runs matched your query.
            </p>
            <button
              onClick={onOpenTriggerModal}
              className="mt-4 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
            >
              Trigger New Generation Run
            </button>
          </div>
        ) : (
          filteredRuns.map((run) => {
            const isSelected = run.id === selectedRunId;
            return (
              <div
                key={run.id}
                onClick={() => onSelectRun(run)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-slate-800/90 border-indigo-500/80 ring-1 ring-indigo-500/50 shadow-md'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getRiskBadge(run.riskAssessment.tier, run.riskAssessment.score)}

                    <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {getChannelIcon(run.channel)}
                      <span className="capitalize">{run.channel.replace('_', ' ')}</span>
                    </span>

                    <span className="text-[11px] font-mono text-slate-400">
                      {run.taskToken}
                    </span>

                    {run.versions.length > 1 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                        v{run.versions.length} (Revised)
                      </span>
                    )}

                    {run.hasHumanModifications && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        Human Edited
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-white truncate">
                    {run.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    <span className="text-slate-500">Source:</span> {run.triggerSource} • <span className="text-slate-500">Audience:</span> {run.targetAudience}
                  </p>
                </div>

                {/* Right side: Reviewer, Status & Action */}
                <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                  <div className="flex items-center gap-2">
                    <img
                      src={run.assignedReviewer.avatar}
                      alt={run.assignedReviewer.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div className="text-right hidden md:block">
                      <span className="block text-xs font-medium text-slate-200">
                        {run.assignedReviewer.name.split(' ')[0]}
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        {run.assignedReviewer.department}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      run.status === 'AWAITING_REVIEW'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : run.status === 'IN_REVISION'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {run.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="p-1 rounded-lg bg-slate-800 text-slate-400 group-hover:text-white">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
