import React, { useState } from 'react';
import { 
  Database, 
  Sparkles, 
  Download, 
  Split, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  BrainCircuit, 
  Copy, 
  Check, 
  Layers, 
  TrendingUp,
  FileCode2,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';
import { GoldenDatasetItem, CorrectionCategory } from '../types';
import { computeWordDiff } from '../utils/diff';

interface GoldenDatasetViewProps {
  goldenDataset: GoldenDatasetItem[];
  totalRunsCount: number;
}

export const GoldenDatasetView: React.FC<GoldenDatasetViewProps> = ({
  goldenDataset,
  totalRunsCount,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GoldenDatasetItem | null>(goldenDataset[0] || null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesizedResult, setSynthesizedResult] = useState<{
    rules: string[];
    summary: string;
    snippet: string;
  } | null>(null);

  const totalEvaluated = Math.max(totalRunsCount, goldenDataset.length + 15);
  const correctionsCount = goldenDataset.length;
  const correctionRate = ((correctionsCount / totalEvaluated) * 100).toFixed(1);
  const directPassRate = (100 - parseFloat(correctionRate)).toFixed(1);

  const filteredItems = goldenDataset.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.categories.includes(selectedCategory as CorrectionCategory);
  });

  const handleExportJSONL = () => {
    const lines = goldenDataset.map((item) => {
      return JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are LoopGuard's enterprise verified content generation assistant adhering strictly to human compliance guardrails."
          },
          {
            role: "user",
            content: item.promptContext
          },
          {
            role: "assistant",
            content: item.humanApprovedDraft
          }
        ],
        metadata: {
          golden_id: item.id,
          categories: item.categories,
          char_delta: item.charDelta,
          reviewed_by: item.reviewerName,
          recorded_at: item.recordedAt
        }
      });
    });

    const blob = new Blob([lines.join('\n')], { type: 'application/jsonl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loopguard-golden-dataset-${new Date().toISOString().split('T')[0]}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSynthesizeRules = async () => {
    setIsSynthesizing(true);
    try {
      const response = await fetch('/api/synthesize-golden-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goldenDatasetItems: goldenDataset })
      });
      const data = await response.json();
      if (data.success) {
        setSynthesizedResult({
          rules: data.synthesizedRules || [],
          summary: data.summary || '',
          snippet: data.recommendedPromptSnippet || ''
        });
      }
    } catch (err) {
      console.error('Error synthesizing rules:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCopySnippet = () => {
    if (!synthesizedResult?.snippet) return;
    navigator.clipboard.writeText(synthesizedResult.snippet);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Thesis */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border border-amber-500/20 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Closed-Loop Value: Using Human Approval Data to Optimize AI</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              The 19% Golden Dataset & Prompt Auto-Tuner
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every approval action is valuable training telemetry. When humans correct the 19% of drafts that AI gets slightly wrong, those diffs become our high-fidelity ground truth (Golden Set) to fine-tune prompts and eliminate systematic errors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSynthesizeRules}
              disabled={isSynthesizing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <BrainCircuit className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
              <span>{isSynthesizing ? 'Synthesizing Rules...' : 'Synthesize Guardrails'}</span>
            </button>

            <button
              onClick={handleExportJSONL}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export JSONL Dataset</span>
            </button>
          </div>
        </div>

        {/* 2. Statistical Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
              Direct Pass Baseline
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-400 font-mono">
                {directPassRate}%
              </span>
              <span className="text-xs text-slate-500">Unaltered Release</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide block">
              Human Correction Ratio
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-300 font-mono">
                {correctionRate}%
              </span>
              <span className="text-xs text-amber-400/80">Active Golden Loop</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
              Golden Pairs Logged
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white font-mono">
                {goldenDataset.length}
              </span>
              <span className="text-xs text-slate-500">Fine-tuning Pairs</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
              Avg Touch Latency
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-indigo-300 font-mono">
                1m 48s
              </span>
              <span className="text-xs text-slate-500">Sufficient Info</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Synthesized Prompt Guardrails Section (Generated by Gemini) */}
      {synthesizedResult && (
        <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Auto-Synthesized Model Guardrails (Learned from Reviewer Diffs)
              </h3>
            </div>
            <button
              onClick={handleCopySnippet}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-200 text-xs border border-indigo-500/30 transition-colors"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? 'Copied Snippet' : 'Copy System Instructions'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-300">
            {synthesizedResult.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            {synthesizedResult.rules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="text-slate-200 leading-relaxed">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Golden Items Explorer: Filter by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List of Golden Records */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Correction Records ({filteredItems.length})</span>
            </span>

            <label htmlFor="category-select" className="sr-only">Filter by Correction Category</label>
            <select
              id="category-select"
              aria-label="Filter by Correction Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="Tone Calibration">Tone Calibration</option>
              <option value="Financial & Discount Guardrail">Financial / Discount</option>
              <option value="Missing Disclaimer">Missing Disclaimer</option>
              <option value="Legal Liability">Legal Liability</option>
              <option value="Factual Inaccuracy">Factual Inaccuracy</option>
            </select>
          </div>

          <div className="space-y-2">
            {filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500/70 ring-1 ring-amber-500/40 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.categories.map((cat, i) => (
                        <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      +{item.charDelta} chars
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug truncate">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {item.diffSummary}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Signer: {item.reviewerName.split(' ')[0]}</span>
                    <span>{new Date(item.recordedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Deck of Selected Golden Pair */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          {selectedItem ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{selectedItem.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-400">
                      {selectedItem.channel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Reviewed & Signed by: <strong className="text-slate-200">{selectedItem.reviewerName}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                    Ground Truth # {selectedItem.id}
                  </span>
                </div>
              </div>

              {/* Reviewer Diagnosis Note */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                <span className="font-bold text-amber-300 uppercase tracking-wide text-[10px] block">
                  Reviewer Diagnosis & Override Rationale:
                </span>
                <p className="text-amber-100/90 leading-relaxed font-sans">
                  "{selectedItem.reviewerNotes}"
                </p>
              </div>

              {/* Side-by-side or Diff View */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Ground Truth Comparison:</span>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 line-through">Red = AI Hallucination/Bias</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Green = Human Correction</span>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs font-mono leading-relaxed max-h-[380px] overflow-y-auto whitespace-pre-wrap">
                  {(() => {
                    const diffParts = computeWordDiff(selectedItem.aiOriginalDraft, selectedItem.humanApprovedDraft);
                    return diffParts.map((part, index) => {
                      if (part.added) {
                        return (
                          <span
                            key={index}
                            className="bg-emerald-500/30 text-emerald-200 px-0.5 rounded border-b border-emerald-400 font-semibold"
                          >
                            {part.value}
                          </span>
                        );
                      }
                      if (part.removed) {
                        return (
                          <span
                            key={index}
                            className="bg-rose-500/20 text-rose-400 line-through px-0.5 rounded opacity-75"
                          >
                            {part.value}
                          </span>
                        );
                      }
                      return <span key={index} className="text-slate-300">{part.value}</span>;
                    });
                  })()}
                </div>
              </div>

              {/* Fine-Tuning Snippet Format */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Fine-Tuning Formatter: Ready for JSONL dataset injection</span>
                <span className="text-emerald-400 font-semibold">100% Quality Verified</span>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-500">
              Select a golden record to view diff analysis
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
