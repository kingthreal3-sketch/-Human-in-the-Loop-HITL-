export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH';

export type ChannelType = 
  | 'email' 
  | 'social_x' 
  | 'social_linkedin' 
  | 'support_ticket' 
  | 'legal_notice' 
  | 'press_release';

export type WorkflowStatus = 
  | 'TRIGGERED' 
  | 'GENERATING' 
  | 'AWAITING_REVIEW' 
  | 'IN_REVISION' 
  | 'APPROVED' 
  | 'DISPATCHED' 
  | 'REJECTED';

export interface PolicyCheck {
  rule: string;
  passed: boolean;
  note: string;
}

export interface RiskAssessment {
  score: number; // 0-100
  tier: RiskTier;
  flags: string[];
  justification: string;
}

export interface DraftVersion {
  versionNumber: number;
  headline: string;
  draft: string;
  reasoning: string;
  citations: string[];
  timestamp: string;
  generatedBy: string;
  reviewerFeedback?: string;
  changeSummary?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  details: string;
  type: 'trigger' | 'ai' | 'notify' | 'edit' | 'revision' | 'approve' | 'dispatch' | 'reject';
}

export interface ReviewerProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  department: string;
}

export interface ApprovalDetails {
  reviewer: string;
  role: string;
  timestamp: string;
  digitalSignature: string;
  signOffNotes: string;
  verifiedHash: string;
}

export interface WorkflowRun {
  id: string;
  taskToken: string;
  title: string;
  triggerSource: string;
  channel: ChannelType;
  targetAudience: string;
  brandTone: string;
  constraints: string;
  context: string;
  status: WorkflowStatus;
  riskAssessment: RiskAssessment;
  policyChecks: PolicyCheck[];
  versions: DraftVersion[];
  currentDraft: string;
  currentHeadline: string;
  hasHumanModifications: boolean;
  assignedReviewer: ReviewerProfile;
  approvalDetails?: ApprovalDetails;
  dispatchedAt?: string;
  auditTrail: AuditEvent[];
  createdAt: string;
  slaExpiresAt: string;
}

export type CorrectionCategory = 
  | 'Tone Calibration' 
  | 'Financial & Discount Guardrail' 
  | 'Missing Disclaimer' 
  | 'Factual Inaccuracy' 
  | 'Formatting & Brevity' 
  | 'Legal Liability';

export interface GoldenDatasetItem {
  id: string;
  runId: string;
  title: string;
  channel: ChannelType;
  promptContext: string;
  aiOriginalDraft: string;
  humanApprovedDraft: string;
  charDelta: number;
  categories: CorrectionCategory[];
  reviewerNotes: string;
  reviewerName: string;
  recordedAt: string;
  diffSummary: string;
}

export interface RiskPolicyConfig {
  autoPassLowRisk: boolean;
  lowRiskThreshold: number; // e.g. 35
  requireDualApprovalHighRisk: boolean;
  slaTimeoutMinutes: number;
  slackWebhookUrl: string;
  sendEmailNotification: boolean;
  requireDigitalSignature: boolean;
}
