import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Mail, 
  MessageSquare, 
  ShieldAlert, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { WorkflowRun } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  run: WorkflowRun;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  run,
}) => {
  const [activeChannel, setActiveChannel] = useState<'slack' | 'email'>('slack');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!isOpen) return null;

  const callbackUrl = `https://loopguard.internal/review?token=${run.taskToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Asynchronous Interruption Notification</h3>
              <p className="text-xs text-slate-400">AWS Step Functions / n8n Wait-for-Callback Dispatch</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Because reviewers do not sit waiting in front of the screen, the system paused execution, emitted task token <code className="text-indigo-400 font-mono bg-slate-950 px-1 py-0.5 rounded border border-slate-800">{run.taskToken}</code>, and dispatched this notification to <strong className="text-white">{run.assignedReviewer.name}</strong>.
        </p>

        {/* Channel Switch */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveChannel('slack')}
            className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeChannel === 'slack' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Slack Block Kit Preview</span>
          </button>
          <button
            onClick={() => setActiveChannel('email')}
            className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeChannel === 'email' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Alert Layout</span>
          </button>
        </div>

        {/* Content Body */}
        {activeChannel === 'slack' ? (
          <div className="bg-[#1A1D21] border border-slate-700/80 rounded-xl p-4 text-xs font-sans text-slate-200 space-y-3 shadow-inner">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-[10px]">
                LG
              </div>
              <span className="font-bold text-white text-xs">LoopGuard HITL Bot</span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 rounded">APP</span>
              <span className="text-[10px] text-slate-500 ml-auto">12:34 PM</span>
            </div>

            <div className="border-l-4 border-amber-500 pl-3 space-y-2 py-1">
              <div className="font-bold text-white text-sm">
                ⚠️ Human Review Required: {run.title}
              </div>
              <p className="text-slate-300 text-xs line-clamp-2">
                A new draft has been generated and flagged for mandatory human approval. Risk tier: <span className="text-rose-400 font-bold">{run.riskAssessment.tier} ({run.riskAssessment.score}/100)</span>.
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-400">
                <div>
                  <span className="text-slate-500 block">Trigger:</span>
                  <span className="text-slate-200 font-medium">{run.triggerSource}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Assigned Reviewer:</span>
                  <span className="text-slate-200 font-medium">{run.assignedReviewer.name}</span>
                </div>
              </div>

              {/* Slack Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Review in Studio
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold"
                >
                  Approve (Direct Pass)
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold"
                >
                  Request Revision
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-sans text-slate-300 space-y-3">
            <div className="flex justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
              <div><strong>From:</strong> alerts@loopguard.internal</div>
              <div><strong>To:</strong> {run.assignedReviewer.email}</div>
            </div>
            <div className="font-bold text-white text-sm">
              [ACTION REQUIRED] Review checkpoint for {run.title}
            </div>
            <p className="text-slate-300 leading-relaxed">
              Hello {run.assignedReviewer.name},<br />
              An automated workflow has paused at an asynchronous checkpoint. Because this content contains <span className="text-amber-300">{run.riskAssessment.flags.join(', ')}</span>, your explicit sign-off is required prior to external publication.
            </p>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
              <div>Task Token: <span className="text-indigo-400">{run.taskToken}</span></div>
              <div>SLA Deadline: <span className="text-slate-400">{new Date(run.slaExpiresAt).toLocaleTimeString()}</span></div>
            </div>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Open Review Station with Sufficient Context
              </button>
            </div>
          </div>
        )}

        {/* Direct Link */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="font-mono text-[11px] text-slate-400 truncate max-w-sm">
            {callbackUrl}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 shrink-0 font-medium text-xs ml-2"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
