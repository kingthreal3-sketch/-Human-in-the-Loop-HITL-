import React from 'react';
import { 
  Sliders, 
  ShieldAlert, 
  Clock, 
  Bell, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Save,
  RotateCcw
} from 'lucide-react';
import { RiskPolicyConfig } from '../types';

interface RiskPolicyConfigViewProps {
  config: RiskPolicyConfig;
  onUpdateConfig: (newConfig: RiskPolicyConfig) => void;
}

export const RiskPolicyConfigView: React.FC<RiskPolicyConfigViewProps> = ({
  config,
  onUpdateConfig,
}) => {
  const [localConfig, setLocalConfig] = React.useState<RiskPolicyConfig>(config);
  const [savedSuccess, setSavedSuccess] = React.useState<boolean>(false);

  const handleSave = () => {
    onUpdateConfig(localConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Risk Tiering & HITL Policy Engine</h2>
              <p className="text-xs text-slate-400">
                Configure automated risk thresholds, SLA timeouts, and anti-rubber-stamping guardrails.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Risk Thresholds */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Risk Tier Calibration</span>
              </h3>
              <p className="text-xs text-slate-400">
                Controls which drafts pause at the HITL gate versus passing autonomously.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Low Risk Cutoff: &lt; {localConfig.lowRiskThreshold}/100
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Autonomous Auto-Pass Threshold (Low Risk)</span>
                <span className="font-mono text-white font-semibold">{localConfig.lowRiskThreshold} / 100</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={localConfig.lowRiskThreshold}
                onChange={(e) => setLocalConfig({ ...localConfig, lowRiskThreshold: parseInt(e.target.value, 10) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>Strict (10: Review everything)</span>
                <span>Balanced (30: Spot-check FAQs)</span>
                <span>Permissive (50: High risk only)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div>
                <span className="text-xs font-medium text-slate-200 block">
                  Enable Autonomous Auto-Pass for Low Risk
                </span>
                <span className="text-[11px] text-slate-500">
                  Drafts scoring below threshold pass directly to dispatch without human intervention.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.autoPassLowRisk}
                  onChange={(e) => setLocalConfig({ ...localConfig, autoPassLowRisk: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div>
                <span className="text-xs font-medium text-slate-200 block">
                  Enforce Dual Approval on High Risk Items
                </span>
                <span className="text-[11px] text-slate-500">
                  Requires both Legal Counsel and Department Lead sign-off for financial/regulatory content.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.requireDualApprovalHighRisk}
                  onChange={(e) => setLocalConfig({ ...localConfig, requireDualApprovalHighRisk: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 2. Asynchronous Notification & Interruption Hooks */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-400" />
              <span>Asynchronous Reviewer Notification Hooks</span>
            </h3>
            <p className="text-xs text-slate-400">
              Dispatches execution token via Slack Block Kit and email so reviewers don't sit waiting at the screen.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="slack-webhook-input" className="block text-xs font-medium text-slate-300 mb-1">
                Slack Incoming Webhook URL:
              </label>
              <input
                id="slack-webhook-input"
                type="text"
                value={localConfig.slackWebhookUrl}
                onChange={(e) => setLocalConfig({ ...localConfig, slackWebhookUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div>
                <span className="text-xs font-medium text-slate-200 block">
                  Send Direct Email Escalation Alerts
                </span>
                <span className="text-[11px] text-slate-500">
                  Sends actionable 1-click token review link to designated reviewer inbox.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.sendEmailNotification}
                  onChange={(e) => setLocalConfig({ ...localConfig, sendEmailNotification: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 3. Anti-Rubber-Stamping & Accountability */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Accountability & Cryptographic Sign-Off</span>
            </h3>
            <p className="text-xs text-slate-400">
              Clear human override authority with immutable audit tracking for compliance.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-200 block">
                Mandatory Cryptographic Sign-off Hash
              </span>
              <span className="text-[11px] text-slate-500">
                Generates SHA-256 integrity hash linking reviewer identity to the exact final published version.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localConfig.requireDigitalSignature}
                onChange={(e) => setLocalConfig({ ...localConfig, requireDigitalSignature: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Policy settings updated successfully!</span>
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Settings take effect on all subsequent AI workflow invocations.
            </span>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Policies</span>
          </button>
        </div>
      </div>
    </div>
  );
};
