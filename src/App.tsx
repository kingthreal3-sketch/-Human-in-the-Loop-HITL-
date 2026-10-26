import React, { useState } from 'react';
import { 
  WorkflowRun, 
  GoldenDatasetItem, 
  ReviewerProfile, 
  RiskPolicyConfig, 
  CorrectionCategory 
} from './types';
import { 
  INITIAL_WORKFLOW_RUNS, 
  INITIAL_GOLDEN_DATASET, 
  REVIEWER_PROFILES, 
  INITIAL_POLICY_CONFIG 
} from './data/seedData';
import { Header } from './components/Header';
import { WorkflowVisualizer } from './components/WorkflowVisualizer';
import { ReviewQueue } from './components/ReviewQueue';
import { ReviewStation } from './components/ReviewStation';
import { GoldenDatasetView } from './components/GoldenDatasetView';
import { RiskPolicyConfigView } from './components/RiskPolicyConfigView';
import { TriggerModal } from './components/TriggerModal';
import { NotificationModal } from './components/NotificationModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { computeDiffStats } from './utils/diff';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>(INITIAL_WORKFLOW_RUNS);
  const [goldenDataset, setGoldenDataset] = useState<GoldenDatasetItem[]>(INITIAL_GOLDEN_DATASET);
  const [policyConfig, setPolicyConfig] = useState<RiskPolicyConfig>(INITIAL_POLICY_CONFIG);
  const [currentReviewer, setCurrentReviewer] = useState<ReviewerProfile>(REVIEWER_PROFILES[0]);
  
  const [activeTab, setActiveTab] = useState<'pipeline' | 'queue' | 'golden' | 'policy'>('pipeline');
  const [selectedRunId, setSelectedRunId] = useState<string>(workflowRuns[0]?.id || '');
  
  // Modals & Async States
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRevising, setIsRevising] = useState<boolean>(false);
  
  // Banner message
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const selectedRun = workflowRuns.find((r) => r.id === selectedRunId) || workflowRuns[0];
  const pendingRunsCount = workflowRuns.filter((r) => r.status === 'AWAITING_REVIEW').length;

  // 1. Trigger New Inbound Run
  const handleTriggerRun = async (payload: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const newTokenId = `itok_stepfn_${Math.floor(10000 + Math.random() * 90000)}_${payload.channel || 'async'}`;

      const newRun: WorkflowRun = {
        id: `run-${Date.now()}`,
        taskToken: newTokenId,
        title: payload.title || data.headline || 'Content Generation Request',
        triggerSource: payload.triggerSource || 'Inbound Automated Trigger',
        channel: payload.channel || 'email',
        targetAudience: payload.targetAudience || 'General Audience',
        brandTone: payload.brandTone || 'Professional & authoritative',
        constraints: payload.constraints || 'Mandatory SLA disclosure',
        context: payload.context || '',
        status: 'AWAITING_REVIEW',
        riskAssessment: data.riskAssessment || {
          score: 65,
          tier: 'MEDIUM',
          flags: ['Public facing communication'],
          justification: 'External dispatch channel.'
        },
        policyChecks: data.policyChecks || [
          { rule: 'Brand tone alignment check', passed: true, note: 'Matches specified enterprise tone.' }
        ],
        versions: [
          {
            versionNumber: 1,
            headline: data.headline || payload.title,
            draft: data.draft || '',
            reasoning: data.reasoning || 'Generated based on prompt parameters.',
            citations: data.citations || ['LoopGuard Standard Style Guide'],
            timestamp: new Date().toISOString(),
            generatedBy: data.source || 'gemini-3.8-flash',
          }
        ],
        currentDraft: data.draft || '',
        currentHeadline: data.headline || payload.title,
        hasHumanModifications: false,
        assignedReviewer: currentReviewer,
        auditTrail: [
          {
            id: `aud-${Date.now()}-1`,
            timestamp: new Date().toISOString(),
            event: 'Inbound Workflow Triggered',
            actor: payload.triggerSource || 'API Gateway',
            details: `Initiated run "${payload.title}"`,
            type: 'trigger'
          },
          {
            id: `aud-${Date.now()}-2`,
            timestamp: new Date().toISOString(),
            event: 'Draft Generated by Gemini 3.8 Flash',
            actor: 'gemini-3.8-flash',
            details: `Risk Score: ${data.riskAssessment?.score || 65} (${data.riskAssessment?.tier || 'MEDIUM'}). Workflow paused.`,
            type: 'ai'
          },
          {
            id: `aud-${Date.now()}-3`,
            timestamp: new Date().toISOString(),
            event: 'Asynchronous Interruption Token Dispatched',
            actor: 'AWS Step Functions / n8n Wait Node',
            details: `Emitted token ${newTokenId}. Dispatched review alert to ${currentReviewer.name}.`,
            type: 'notify'
          }
        ],
        createdAt: new Date().toISOString(),
        slaExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      };

      setWorkflowRuns(prev => [newRun, ...prev]);
      setSelectedRunId(newRun.id);
      setIsTriggerModalOpen(false);
      setActiveTab('queue');

      showToast(
        "Workflow Paused at Human Checkpoint",
        `Generated draft for "${newRun.title}". Interruption token ${newTokenId} issued.`,
        "info"
      );
    } catch (err: any) {
      console.error('Trigger run error:', err);
      showToast("Trigger Generation Failed", err.message || "Please check network or backend.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Request Revision Loop ("generate-revise-regenerate")
  const handleRequestRevision = async (runId: string, feedback: string) => {
    const run = workflowRuns.find(r => r.id === runId);
    if (!run) return;

    setIsRevising(true);
    try {
      const response = await fetch('/api/revise-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalContext: {
            title: run.title,
            channel: run.channel,
            targetAudience: run.targetAudience,
            constraints: run.constraints,
            brandTone: run.brandTone,
          },
          previousDraft: run.currentDraft,
          reviewerFeedback: feedback,
          versionNumber: run.versions.length,
        }),
      });

      const data = await response.json();
      const newVersionNum = run.versions.length + 1;

      const newVersion = {
        versionNumber: newVersionNum,
        headline: run.currentHeadline,
        draft: data.revisedDraft || run.currentDraft,
        reasoning: data.revisionNotes || `Incorporated human critique: "${feedback}"`,
        citations: [...(run.versions[0]?.citations || []), 'Reviewer Editorial Instruction'],
        timestamp: new Date().toISOString(),
        generatedBy: `${data.source || 'gemini-3.8-flash'} (Revision Loop)`,
        reviewerFeedback: feedback,
        changeSummary: data.changeSummary || 'Regenerated with reviewer feedback incorporated.'
      };

      setWorkflowRuns(prev => prev.map(r => {
        if (r.id !== runId) return r;
        return {
          ...r,
          status: 'AWAITING_REVIEW',
          versions: [...r.versions, newVersion],
          currentDraft: newVersion.draft,
          hasHumanModifications: true,
          auditTrail: [
            ...r.auditTrail,
            {
              id: `aud-${Date.now()}-rev1`,
              timestamp: new Date().toISOString(),
              event: 'Human Reviewer Requested Revision',
              actor: currentReviewer.name,
              details: `Critique: "${feedback}"`,
              type: 'revision'
            },
            {
              id: `aud-${Date.now()}-rev2`,
              timestamp: new Date().toISOString(),
              event: `AI Regenerated Version v${newVersionNum}`,
              actor: 'gemini-3.8-flash (Revision Loop)',
              details: data.changeSummary || 'Incorporated feedback and updated phrasing.',
              type: 'ai'
            }
          ]
        };
      }));

      showToast(
        `Revision v${newVersionNum} Generated!`,
        `Gemini 3.8 Flash incorporated reviewer critique: "${feedback.slice(0, 50)}..."`,
        "success"
      );
    } catch (err: any) {
      console.error('Revision error:', err);
      showToast("Revision Request Failed", err.message, "error");
    } finally {
      setIsRevising(false);
    }
  };

  // 3. Approve & Dispatch (Human Override Authority + 19% Golden Dataset Capture)
  const handleApproveAndDispatch = (
    runId: string,
    finalDraft: string,
    finalHeadline: string,
    notes: string,
    category?: CorrectionCategory
  ) => {
    const run = workflowRuns.find(r => r.id === runId);
    if (!run) return;

    const originalDraft = run.versions[0]?.draft || '';
    const diffStats = computeDiffStats(originalDraft, finalDraft);
    const hasModifications = !diffStats.isIdentical;

    // Generate SHA-256 style verification hash
    const fakeHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const approvalDetails = {
      reviewer: currentReviewer.name,
      role: currentReviewer.role,
      timestamp: new Date().toISOString(),
      digitalSignature: `SIG_${currentReviewer.name.replace(/\s+/g, '').toUpperCase()}_RSA4096_VERIFIED`,
      signOffNotes: notes,
      verifiedHash: fakeHash,
    };

    // If human modified the draft, automatically log to the 19% Golden Dataset!
    if (hasModifications && category) {
      const newGoldenItem: GoldenDatasetItem = {
        id: `gold_${Date.now()}`,
        runId: run.id,
        title: run.title,
        channel: run.channel,
        promptContext: `${run.title} • Target: ${run.targetAudience} • Constraints: ${run.constraints}`,
        aiOriginalDraft: originalDraft,
        humanApprovedDraft: finalDraft,
        charDelta: diffStats.charDelta,
        categories: [category],
        reviewerNotes: notes,
        reviewerName: currentReviewer.name,
        recordedAt: new Date().toISOString(),
        diffSummary: diffStats.summary,
      };

      setGoldenDataset(prev => [newGoldenItem, ...prev]);
    }

    setWorkflowRuns(prev => prev.map(r => {
      if (r.id !== runId) return r;
      return {
        ...r,
        status: 'DISPATCHED',
        currentDraft: finalDraft,
        currentHeadline: finalHeadline,
        hasHumanModifications: hasModifications,
        approvalDetails,
        dispatchedAt: new Date().toISOString(),
        auditTrail: [
          ...r.auditTrail,
          {
            id: `aud-${Date.now()}-app`,
            timestamp: new Date().toISOString(),
            event: 'Cryptographic Human Sign-Off Affixed',
            actor: `${currentReviewer.name} (${currentReviewer.role})`,
            details: `Approved draft with hash: ${fakeHash.slice(0, 16)}... Notes: "${notes}"`,
            type: 'approve'
          },
          {
            id: `aud-${Date.now()}-disp`,
            timestamp: new Date().toISOString(),
            event: 'Workflow Resumed & Content Dispatched',
            actor: 'LoopGuard Dispatch Engine',
            details: `Published externally to ${run.channel}. Task token ${run.taskToken} fulfilled.`,
            type: 'dispatch'
          }
        ]
      };
    }));

    showToast(
      "Workflow Resumed & Dispatched!",
      hasModifications
        ? `Cryptographically signed by ${currentReviewer.name}. Logged human correction to the 19% Golden Dataset!`
        : `Cryptographically signed by ${currentReviewer.name}. Direct pass dispatched to ${run.channel}.`,
      "success"
    );
  };

  // 4. Reject and Terminate Run
  const handleRejectRun = (runId: string, reason: string) => {
    setWorkflowRuns(prev => prev.map(r => {
      if (r.id !== runId) return r;
      return {
        ...r,
        status: 'REJECTED',
        auditTrail: [
          ...r.auditTrail,
          {
            id: `aud-${Date.now()}-rej`,
            timestamp: new Date().toISOString(),
            event: 'Human Reviewer Terminated Workflow',
            actor: currentReviewer.name,
            details: `Reason: "${reason}". Task token revoked.`,
            type: 'reject'
          }
        ]
      };
    }));

    showToast("Workflow Terminated", "Task token cancelled; no content dispatched.", "info");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-18 right-6 z-50 max-w-md p-4 rounded-xl shadow-2xl border backdrop-blur-md bg-slate-900/95 border-indigo-500/50 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-white">{toastMessage.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toastMessage.desc}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-500 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingRunsCount={pendingRunsCount}
        currentReviewer={currentReviewer}
        setCurrentReviewer={setCurrentReviewer}
        onOpenTriggerModal={() => setIsTriggerModalOpen(true)}
        workflowRuns={workflowRuns}
      />

      {/* Body Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Visual Pipeline & Run Showcase */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6 animate-in fade-in">
            <WorkflowVisualizer
              currentRun={selectedRun}
              allRuns={workflowRuns}
              onSelectRun={(run) => {
                setSelectedRunId(run.id);
                setActiveTab('queue');
              }}
              onOpenTriggerModal={() => setIsTriggerModalOpen(true)}
            />

            <ReviewQueue
              runs={workflowRuns}
              selectedRunId={selectedRunId}
              onSelectRun={(run) => {
                setSelectedRunId(run.id);
                setActiveTab('queue');
              }}
              onOpenTriggerModal={() => setIsTriggerModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: Review Station (The HITL Checkpoint) */}
        {activeTab === 'queue' && (
          <div className="space-y-6 animate-in fade-in">
            {selectedRun ? (
              <ReviewStation
                run={selectedRun}
                currentReviewer={currentReviewer}
                onApproveAndDispatch={handleApproveAndDispatch}
                onRequestRevision={handleRequestRevision}
                onRejectRun={handleRejectRun}
                onOpenAuditModal={() => setIsAuditModalOpen(true)}
                onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
                isRevising={isRevising}
              />
            ) : (
              <div className="text-center py-16 text-slate-400">
                No active run selected. Choose a run from the queue.
              </div>
            )}

            <ReviewQueue
              runs={workflowRuns}
              selectedRunId={selectedRunId}
              onSelectRun={(run) => setSelectedRunId(run.id)}
              onOpenTriggerModal={() => setIsTriggerModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 3: The 19% Golden Dataset & Auto-Tuner */}
        {activeTab === 'golden' && (
          <div className="animate-in fade-in">
            <GoldenDatasetView
              goldenDataset={goldenDataset}
              totalRunsCount={workflowRuns.length}
            />
          </div>
        )}

        {/* Tab 4: Policy & Risk Engine */}
        {activeTab === 'policy' && (
          <div className="animate-in fade-in">
            <RiskPolicyConfigView
              config={policyConfig}
              onUpdateConfig={(newCfg) => {
                setPolicyConfig(newCfg);
                showToast("Policies Updated", "New risk thresholds and notification hooks are active.", "success");
              }}
            />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <TriggerModal
        isOpen={isTriggerModalOpen}
        onClose={() => setIsTriggerModalOpen(false)}
        onTriggerRun={handleTriggerRun}
        isGenerating={isGenerating}
        currentReviewer={currentReviewer}
      />

      {selectedRun && (
        <>
          <NotificationModal
            isOpen={isNotificationModalOpen}
            onClose={() => setIsNotificationModalOpen(false)}
            run={selectedRun}
          />

          <AuditTrailModal
            isOpen={isAuditModalOpen}
            onClose={() => setIsAuditModalOpen(false)}
            run={selectedRun}
          />
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>LoopGuard • Enterprise Human-in-the-Loop Content Generation Studio</span>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Asynchronous Step Interruption Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
