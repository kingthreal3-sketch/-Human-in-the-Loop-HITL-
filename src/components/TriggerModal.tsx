import React, { useState } from 'react';
import { 
  Zap, 
  X, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Bot
} from 'lucide-react';
import { ChannelType, WorkflowRun, ReviewerProfile } from '../types';
import { PRESET_SCENARIOS, REVIEWER_PROFILES } from '../data/seedData';

interface TriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerRun: (runData: any) => Promise<void>;
  isGenerating: boolean;
  currentReviewer: ReviewerProfile;
}

export const TriggerModal: React.FC<TriggerModalProps> = ({
  isOpen,
  onClose,
  onTriggerRun,
  isGenerating,
  currentReviewer,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  
  // Custom form state
  const [title, setTitle] = useState<string>('');
  const [triggerSource, setTriggerSource] = useState<string>('');
  const [channel, setChannel] = useState<ChannelType>('email');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [brandTone, setBrandTone] = useState<string>('Professional, empathetic, authoritative');
  const [constraints, setConstraints] = useState<string>('Specify exact timeline, no forward-looking promises, include disclaimer.');
  const [context, setContext] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectPreset = async (preset: typeof PRESET_SCENARIOS[0]) => {
    await onTriggerRun({
      title: preset.title,
      triggerSource: preset.triggerSource,
      channel: preset.channel,
      targetAudience: preset.targetAudience,
      brandTone: preset.brandTone,
      constraints: preset.constraints,
      context: preset.context,
    });
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onTriggerRun({
      title,
      triggerSource: triggerSource || 'Manual Operator Trigger',
      channel,
      targetAudience: targetAudience || 'General Audience',
      brandTone,
      constraints,
      context,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Trigger New Content Generation Run</h2>
              <p className="text-xs text-slate-400">
                Step 1: Inbound Trigger & AI Drafting → Pauses at Human Checkpoint
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'presets' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High-Stakes Real-World Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'custom' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom Inbound Brief
          </button>
        </div>

        {/* Presets List */}
        {activeTab === 'presets' ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-300">
              Select an enterprise scenario to trigger the pipeline. Gemini 3.8 Flash will generate the draft, calculate risk scores, and pause for human review:
            </p>

            <div className="space-y-2">
              {PRESET_SCENARIOS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => !isGenerating && handleSelectPreset(preset)}
                  className={`p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isGenerating ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {preset.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-400 border border-slate-800 capitalize">
                        {preset.channel.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {preset.triggerSource} • Tone: {preset.brandTone}
                    </p>
                  </div>

                  <button
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Run Trigger</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Custom Form */
          <form onSubmit={handleCustomSubmit} className="space-y-3 text-xs">
            <div>
              <label htmlFor="custom-title-input" className="block text-slate-400 font-semibold mb-1">
                Title / Topic:
              </label>
              <input
                id="custom-title-input"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Q4 Enterprise Customer Retention Proposal"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="custom-trigger-source-input" className="block text-slate-400 font-semibold mb-1">
                  Trigger Source:
                </label>
                <input
                  id="custom-trigger-source-input"
                  type="text"
                  value={triggerSource}
                  onChange={(e) => setTriggerSource(e.target.value)}
                  placeholder="e.g., Salesforce Escalation #9901"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="custom-channel-select" className="block text-slate-400 font-semibold mb-1">
                  Target Channel:
                </label>
                <select
                  id="custom-channel-select"
                  aria-label="Target Channel"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as ChannelType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="email">Email Dispatch</option>
                  <option value="social_linkedin">LinkedIn Post</option>
                  <option value="social_x">X / Twitter Thread</option>
                  <option value="support_ticket">Zendesk Support Ticket</option>
                  <option value="legal_notice">Legal Regulatory Notice</option>
                  <option value="press_release">Press Release</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="custom-audience-input" className="block text-slate-400 font-semibold mb-1">
                Target Audience:
              </label>
              <input
                id="custom-audience-input"
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., CTOs and Procurement Executives"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="custom-tone-input" className="block text-slate-400 font-semibold mb-1">
                Tone & Voice Guidelines:
              </label>
              <input
                id="custom-tone-input"
                type="text"
                value={brandTone}
                onChange={(e) => setBrandTone(e.target.value)}
                placeholder="e.g., Empathetic, accountable, professional"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="custom-constraints-input" className="block text-slate-400 font-semibold mb-1">
                Strict Constraints & Mandatory Terms:
              </label>
              <input
                id="custom-constraints-input"
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g., Must specify exact refund timeline and discount codes"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="custom-context-input" className="block text-slate-400 font-semibold mb-1">
                Background Context:
              </label>
              <textarea
                id="custom-context-input"
                rows={3}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Add customer history, prior interactions, or specific details..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating || !title.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Generating via Gemini...' : 'Generate & Pause for Review'}</span>
              </button>
            </div>
          </form>
        )}

        {isGenerating && (
          <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-center space-y-2 animate-pulse">
            <Bot className="w-6 h-6 text-indigo-400 mx-auto" />
            <p className="text-xs text-indigo-200 font-medium">
              Gemini 3.8 Flash is generating draft, evaluating policy rules, and computing risk score...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
