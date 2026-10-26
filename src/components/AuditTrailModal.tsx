import React from 'react';
import { 
  History, 
  X, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Bot, 
  Bell, 
  FileEdit, 
  RefreshCw, 
  Send 
} from 'lucide-react';
import { WorkflowRun } from '../types';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  run: WorkflowRun;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  run,
}) => {
  if (!isOpen) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'ai':
        return <Bot className="w-3.5 h-3.5 text-indigo-400" />;
      case 'notify':
        return <Bell className="w-3.5 h-3.5 text-sky-400" />;
      case 'edit':
        return <FileEdit className="w-3.5 h-3.5 text-purple-400" />;
      case 'revision':
        return <RefreshCw className="w-3.5 h-3.5 text-rose-400" />;
      case 'approve':
        return <Lock className="w-3.5 h-3.5 text-emerald-400" />;
      case 'dispatch':
        return <Send className="w-3.5 h-3.5 text-teal-400" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Event-Sourced Cryptographic Audit Ledger</h3>
              <p className="text-xs text-slate-400">SOC-2, EU AI Act & Regulatory Oversight Traceability</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accountability Box */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Workflow Token:</span>
            <span className="font-mono text-indigo-400">{run.taskToken}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Assigned Compliance Lead:</span>
            <span className="text-slate-200 font-semibold">{run.assignedReviewer.name}</span>
          </div>
          {run.approvalDetails && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Cryptographic SHA-256 Hash:</span>
                <span className="font-mono text-[11px] text-emerald-400 truncate max-w-[280px]">
                  {run.approvalDetails.verifiedHash}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Digital Signature Stamp:</span>
                <span className="font-mono text-slate-300">{run.approvalDetails.digitalSignature}</span>
              </div>
              <div className="text-slate-300 italic pt-1">
                "{run.approvalDetails.signOffNotes}"
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-4 pt-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Chronological State Transitions:
          </span>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {run.auditTrail.map((item, index) => (
              <div key={item.id} className="relative space-y-1">
                {/* Node icon */}
                <div className="absolute -left-[27px] top-0.5 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                  {getEventIcon(item.type)}
                </div>

                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">
                    {item.event}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  {item.details}
                </p>

                <div className="text-[10px] text-slate-500 font-mono">
                  Actor: <span className="text-slate-400">{item.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};
