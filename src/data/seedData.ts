import { WorkflowRun, GoldenDatasetItem, ReviewerProfile, RiskPolicyConfig } from '../types';

export const REVIEWER_PROFILES: ReviewerProfile[] = [
  {
    id: 'rev_1',
    name: 'Sarah Vance, Esq.',
    role: 'Lead Regulatory & Compliance Counsel',
    email: 'sarah.vance@loopguard.internal',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Legal & Risk'
  },
  {
    id: 'rev_2',
    name: 'Marcus Chen',
    role: 'Director of Brand & Communications',
    email: 'marcus.chen@loopguard.internal',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Marketing & Editorial'
  },
  {
    id: 'rev_3',
    name: 'Elena Rostova',
    role: 'VP of Customer Experience Operations',
    email: 'elena.rostova@loopguard.internal',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Support & Success'
  }
];

export const INITIAL_POLICY_CONFIG: RiskPolicyConfig = {
  autoPassLowRisk: false,
  lowRiskThreshold: 30,
  requireDualApprovalHighRisk: true,
  slaTimeoutMinutes: 60,
  slackWebhookUrl: 'https://hooks.slack.com/services/T00/B00/loopguard-hitl-alerts',
  sendEmailNotification: true,
  requireDigitalSignature: true
};

export const INITIAL_WORKFLOW_RUNS: WorkflowRun[] = [
  {
    id: 'run-hitl-101',
    taskToken: 'itok_stepfn_99341_billing_esc',
    title: 'High-Stakes VIP Billing Overcharge & Service Credit Settlement',
    triggerSource: 'Zendesk VIP Escalation #88491 (Apex Financial Partners)',
    channel: 'support_ticket',
    targetAudience: 'CTO & Finance Director of Enterprise Client',
    brandTone: 'Deeply empathetic, commercially accountable, firm SLA guarantees',
    constraints: 'Specify exact refund timeline (3-5 banking days). Confirm $420 pro-rata reversal. Offer 15% renewal goodwill voucher with 90-day expiry.',
    context: 'Customer was mistakenly charged dual seats during migrating to SSO SAML. ARR is $94,000. Customer threatened to churn if not resolved today.',
    status: 'AWAITING_REVIEW',
    riskAssessment: {
      score: 82,
      tier: 'HIGH',
      flags: [
        'Direct monetary refund commitment ($420.00)',
        'Promotional coupon issuance (15% Goodwill)',
        'Legal dispute settlement terms'
      ],
      justification: 'Contains binding contractual compensation and cash refund. Line-by-line review mandated by Corporate Treasury & Legal policy.'
    },
    policyChecks: [
      { rule: 'Ledger alignment: $420 amount verified against Stripe dispute #tx_99', passed: true, note: 'Amount matches exact ledger delta.' },
      { rule: 'No open-ended liability or legal fault admission', passed: true, note: 'Draft frames discrepancy as migration sync variance.' },
      { rule: 'Required VIP support lead signature & phone escalation', passed: false, note: 'Human reviewer must append direct tier-3 escalation contact.' }
    ],
    versions: [
      {
        versionNumber: 1,
        headline: 'Resolution & $420.00 Service Credit Adjustment for Apex Financial Partners (#88491)',
        draft: `Dear Jonathan,\n\nThank you for speaking with our technical operations team this morning regarding Ticket #88491. On behalf of the LoopGuard executive leadership, I sincerely apologize for the frustration caused by the duplicate seat billing during your SSO SAML cutover.\n\nWe have verified our auth synchronizer logs and confirmed the erroneous pro-rated charge. We have already initiated a full refund of $420.00 directly to your corporate Amex on file. Banking processing typically clears within 3 to 5 business days.\n\nFurthermore, to reaffirm our partnership and accountability to your 99.99% uptime mandate, we have credited your organization with a 15% discount code (APEX-SSO-CREDIT) applied automatically to your Q1 renewal.\n\nI will remain your personal point of contact until your next billing statement reflects zero balance. Please let me know if we can schedule a quick 10-minute check-in tomorrow.\n\nWarm regards,\nLoopGuard Executive Customer Operations`,
        reasoning: 'Prioritized rapid trust restoration for a high-ARR client. Addressed the specific SSO migration root cause without making broad technical defect admissions.',
        citations: [
          'Enterprise Customer Retention SOP Section 9.1',
          'SaaS Billing Dispute Agreement (Rev 2026)',
          'Stripe Enterprise Refund Protocol'
        ],
        timestamp: '2026-10-26T09:15:00Z',
        generatedBy: 'gemini-3.8-flash'
      }
    ],
    currentDraft: `Dear Jonathan,\n\nThank you for speaking with our technical operations team this morning regarding Ticket #88491. On behalf of the LoopGuard executive leadership, I sincerely apologize for the frustration caused by the duplicate seat billing during your SSO SAML cutover.\n\nWe have verified our auth synchronizer logs and confirmed the erroneous pro-rated charge. We have already initiated a full refund of $420.00 directly to your corporate Amex on file. Banking processing typically clears within 3 to 5 business days.\n\nFurthermore, to reaffirm our partnership and accountability to your 99.99% uptime mandate, we have credited your organization with a 15% discount code (APEX-SSO-CREDIT) applied automatically to your Q1 renewal.\n\nI will remain your personal point of contact until your next billing statement reflects zero balance. Please let me know if we can schedule a quick 10-minute check-in tomorrow.\n\nWarm regards,\nLoopGuard Executive Customer Operations`,
    currentHeadline: 'Resolution & $420.00 Service Credit Adjustment for Apex Financial Partners (#88491)',
    hasHumanModifications: false,
    assignedReviewer: REVIEWER_PROFILES[2], // Elena
    auditTrail: [
      {
        id: 'aud_1',
        timestamp: '2026-10-26T09:14:40Z',
        event: 'Inbound Webhook Trigger Received',
        actor: 'Zendesk VIP Integration',
        details: 'High-priority ticket #88491 triggered automated workflow',
        type: 'trigger'
      },
      {
        id: 'aud_2',
        timestamp: '2026-10-26T09:15:00Z',
        event: 'AI Initial Generation & Risk Scoring',
        actor: 'Gemini 3.8 Flash (Server Agent)',
        details: 'Generated v1 draft. Risk calculated at 82 (HIGH - Financial/Settlement). Task paused.',
        type: 'ai'
      },
      {
        id: 'aud_3',
        timestamp: '2026-10-26T09:15:02Z',
        event: 'Interruption Token Emitted & Reviewer Notified',
        actor: 'AWS Step Functions Engine',
        details: 'Emitted token itok_stepfn_99341_billing_esc. Dispatched Slack block kit notification to #cx-leads.',
        type: 'notify'
      }
    ],
    createdAt: '2026-10-26T09:14:40Z',
    slaExpiresAt: '2026-10-26T10:14:40Z'
  },
  {
    id: 'run-hitl-102',
    taskToken: 'itok_stepfn_77102_social_launch',
    title: 'v2.5 Async Agent Interruption & n8n HITL Engine Announcement',
    triggerSource: 'Product Marketing Sprint 42 Release Pipeline',
    channel: 'social_linkedin',
    targetAudience: 'CTOs, AI Architects, Enterprise Compliance Officers',
    brandTone: 'Crisp, intellectually rigorous, zero marketing fluff, technical authority',
    constraints: 'Highlight 19% human correction dataset, AWS Step Functions wait token pattern, and cryptographic audit hash.',
    context: 'Announcing our newest product breakthrough showing why "generate-and-forget" fails in enterprise production.',
    status: 'AWAITING_REVIEW',
    riskAssessment: {
      score: 52,
      tier: 'MEDIUM',
      flags: [
        'Public performance claims',
        'Customer statistic citation (19% correction rate)',
        'External product integration references'
      ],
      justification: 'External public brand announcement. Medium risk due to technical claims and integration references.'
    },
    policyChecks: [
      { rule: 'Accurate trademark citation for AWS Step Functions & n8n', passed: true, note: 'Partner terms cited per brand guide.' },
      { rule: 'No disparagement of pure-autonomous LLM architectures', passed: true, note: 'Positioned as defense-in-depth rather than anti-AI.' },
      { rule: 'Call-to-action link points to verified staging sandbox', passed: true, note: 'URL verified.' }
    ],
    versions: [
      {
        versionNumber: 1,
        headline: 'Why 19% Human Correction Rate is the Real Metric for AI Success',
        draft: `Most enterprise AI demos show off 100% autonomous magic. In high-stakes production, that's a liability.\n\nReal clinical and financial AI deployments show that ~81% of content passes cleanly, but the remaining 19% required critical human correction.\n\nThat 19% is not a failure—it's your most valuable fine-tuning asset.\n\nToday, we're launching LoopGuard v2.5:\n\n1️⃣ Asynchronous Wait Tokens: Models pause execution via AWS Step Functions & n8n interruption hooks, awaiting human review.\n2️⃣ Side-by-Side Word Diffing: Instant visual review of AI drafts with zero rubber-stamping.\n3️⃣ Golden Dataset Closed Loop: Every human edit automatically streams into a fine-tuning dataset to cure future hallucination.\n\nStop crossing your fingers with autonomous agents. Put the human in the loop: https://loopguard.internal/v2.5-launch\n\n#ArtificialIntelligence #EnterpriseSoftware #Compliance #MachineLearning`,
        reasoning: 'Constructed an authoritative thought-leadership argument around the 19% human correction metric. Provides concrete architectural value propositions.',
        citations: [
          'Enterprise AI Safety Benchmarks 2026',
          'LoopGuard Product Whitepaper Sec 3: Asynchronous Human Interruption'
        ],
        timestamp: '2026-10-26T08:50:00Z',
        generatedBy: 'gemini-3.8-flash'
      }
    ],
    currentDraft: `Most enterprise AI demos show off 100% autonomous magic. In high-stakes production, that's a liability.\n\nReal clinical and financial AI deployments show that ~81% of content passes cleanly, but the remaining 19% required critical human correction.\n\nThat 19% is not a failure—it's your most valuable fine-tuning asset.\n\nToday, we're launching LoopGuard v2.5:\n\n1️⃣ Asynchronous Wait Tokens: Models pause execution via AWS Step Functions & n8n interruption hooks, awaiting human review.\n2️⃣ Side-by-Side Word Diffing: Instant visual review of AI drafts with zero rubber-stamping.\n3️⃣ Golden Dataset Closed Loop: Every human edit automatically streams into a fine-tuning dataset to cure future hallucination.\n\nStop crossing your fingers with autonomous agents. Put the human in the loop: https://loopguard.internal/v2.5-launch\n\n#ArtificialIntelligence #EnterpriseSoftware #Compliance #MachineLearning`,
    currentHeadline: 'Why 19% Human Correction Rate is the Real Metric for AI Success',
    hasHumanModifications: false,
    assignedReviewer: REVIEWER_PROFILES[1], // Marcus
    auditTrail: [
      {
        id: 'aud_10',
        timestamp: '2026-10-26T08:49:10Z',
        event: 'Marketing Trigger Activated',
        actor: 'Product Marketing CI/CD',
        details: 'Scheduled post trigger for sprint v2.5 launch',
        type: 'trigger'
      },
      {
        id: 'aud_11',
        timestamp: '2026-10-26T08:50:00Z',
        event: 'Draft Generated by Gemini 3.8 Flash',
        actor: 'Gemini 3.8 Flash',
        details: 'Generated v1 draft with risk score 52 (MEDIUM). Routed to Marcus Chen.',
        type: 'ai'
      }
    ],
    createdAt: '2026-10-26T08:49:10Z',
    slaExpiresAt: '2026-10-26T11:49:10Z'
  },
  {
    id: 'run-hitl-103',
    taskToken: 'itok_stepfn_33012_privacy_amend',
    title: 'Customer Data Processing Addendum (DPA) AI Retention Amendment',
    triggerSource: 'Legal Department Regulatory Compliance Review',
    channel: 'legal_notice',
    targetAudience: 'All Active Cloud Customers & Enterprise Security Contacts',
    brandTone: 'Legally precise, unambiguous, reassuring, compliance-centric',
    constraints: 'Specify 0-day retention on raw customer prompts by default. Highlight EU AI Act Article 14 human oversight compliance. Provide direct DPO contact.',
    context: 'Mandatory annual legal notice for our 45,000 active organizations regarding updated model fine-tuning boundaries.',
    status: 'APPROVED',
    riskAssessment: {
      score: 91,
      tier: 'HIGH',
      flags: [
        'Contractual terms amendment',
        'Regulatory representations (EU AI Act & SOC-2)',
        'Legal liability implications'
      ],
      justification: 'High regulatory impact. Required full legal counsel review and digital cryptographic sign-off.'
    },
    policyChecks: [
      { rule: 'Clear 30-day notice period before enforcement', passed: true, note: 'Notice period explicitly dated.' },
      { rule: 'Mandatory DPO contact details', passed: true, note: 'dpo@loopguard.internal listed.' },
      { rule: 'Explicit opt-out mechanism description', passed: true, note: 'Opt-out workflow linked.' }
    ],
    versions: [
      {
        versionNumber: 1,
        headline: 'Notice of AI Data Processing Terms Update',
        draft: `Dear Customer,\n\nWe are revising our AI Data Governance terms. We do not store your data for more than 30 days unless you opt in. Reviewers might see your prompts if needed for troubleshooting.\n\nContact us if you have questions.`,
        reasoning: 'Initial automated draft was too informal and lacked specific statutory citations.',
        citations: ['Internal Legal Draft v0.1'],
        timestamp: '2026-10-26T07:10:00Z',
        generatedBy: 'gemini-3.8-flash'
      },
      {
        versionNumber: 2,
        headline: 'Formal Notice: Amendment to AI Governance & Zero-Retention Processing Addendum',
        draft: `To our valued enterprise partners,\n\nEffective December 1, 2026, LoopGuard is instituting formalized amendments to our Data Processing Addendum (DPA) to align with EU Artificial Intelligence Act (AIA) Article 14 human oversight standards.\n\nCore Guarantees:\n1. Zero-Retention Default: Enterprise prompt payloads and generated drafts are processed entirely in-memory with zero persistent training retention on foundational base models.\n2. Isolated Tenant Closed-Loop: Reviewer correction logs (Golden Dataset) remain strictly segregated within your dedicated sovereign encryption enclave.\n3. Continuous Human Oversight: Mandatory HITL checkpoints remain hard-enforced for all financial, regulatory, and public brand dispatch channels.\n\nShould your compliance officers require an updated counter-signed DPA or SOC-2 Type II audit report, please submit a request to dpo@loopguard.internal.\n\nSincerely,\nOffice of the Data Protection Officer & Regulatory Counsel`,
        reasoning: 'Rewritten per human legal counsel critique: inserted precise statutory guarantees, zero-retention defaults, and official DPO channel.',
        citations: ['EU AI Act Art 14', 'ISO/IEC 42001 AI Management Standards', 'SOC 2 Type II Privacy Principles'],
        timestamp: '2026-10-26T07:28:00Z',
        generatedBy: 'gemini-3.8-flash (Revision Loop)',
        reviewerFeedback: 'The draft was far too casual. Rewrite it to cite EU AI Act Article 14, state the exact zero-retention guarantee, and provide the official DPO email address.'
      }
    ],
    currentDraft: `To our valued enterprise partners,\n\nEffective December 1, 2026, LoopGuard is instituting formalized amendments to our Data Processing Addendum (DPA) to align with EU Artificial Intelligence Act (AIA) Article 14 human oversight standards.\n\nCore Guarantees:\n1. Zero-Retention Default: Enterprise prompt payloads and generated drafts are processed entirely in-memory with zero persistent training retention on foundational base models.\n2. Isolated Tenant Closed-Loop: Reviewer correction logs (Golden Dataset) remain strictly segregated within your dedicated sovereign encryption enclave.\n3. Continuous Human Oversight: Mandatory HITL checkpoints remain hard-enforced for all financial, regulatory, and public brand dispatch channels.\n\nShould your compliance officers require an updated counter-signed DPA or SOC-2 Type II audit report, please submit a request to dpo@loopguard.internal.\n\nSincerely,\nOffice of the Data Protection Officer & Regulatory Counsel`,
    currentHeadline: 'Formal Notice: Amendment to AI Governance & Zero-Retention Processing Addendum',
    hasHumanModifications: true,
    assignedReviewer: REVIEWER_PROFILES[0], // Sarah
    approvalDetails: {
      reviewer: 'Sarah Vance, Esq.',
      role: 'Lead Regulatory & Compliance Counsel',
      timestamp: '2026-10-26T07:45:12Z',
      digitalSignature: 'SIG_SV_9901_RSA4096_VERIFIED',
      signOffNotes: 'Audited statutory citations against EU AI Act Art 14 and customer DPA schedule 3. Approved for automated email dispatch.',
      verifiedHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    dispatchedAt: '2026-10-26T07:46:00Z',
    auditTrail: [
      { id: 'a1', timestamp: '2026-10-26T07:09:12Z', event: 'Regulatory Mandate Trigger', actor: 'Compliance CI Engine', details: 'Triggered annual DPA update', type: 'trigger' },
      { id: 'a2', timestamp: '2026-10-26T07:10:00Z', event: 'Initial AI Generation', actor: 'Gemini 3.8 Flash', details: 'Generated v1. Flagged as HIGH RISK (91). Paused.', type: 'ai' },
      { id: 'a3', timestamp: '2026-10-26T07:22:00Z', event: 'Revision Loop Requested by Counsel', actor: 'Sarah Vance, Esq.', details: 'Feedback: Too casual. Add EU AI Act Art 14 and Zero-Retention guarantee.', type: 'revision' },
      { id: 'a4', timestamp: '2026-10-26T07:28:00Z', event: 'AI Regenerated v2', actor: 'Gemini 3.8 Flash', details: 'Synthesized v2 incorporating feedback and statutory citations.', type: 'ai' },
      { id: 'a5', timestamp: '2026-10-26T07:45:12Z', event: 'Human Digital Sign-off', actor: 'Sarah Vance, Esq.', details: 'Affixed RSA signature and compliance clearance hash.', type: 'approve' },
      { id: 'a6', timestamp: '2026-10-26T07:46:00Z', event: 'Workflow Resumed & Dispatched', actor: 'LoopGuard Dispatch Engine', details: 'Transmitted via SendGrid to 45,120 tenant administrators.', type: 'dispatch' }
    ],
    createdAt: '2026-10-26T07:09:12Z',
    slaExpiresAt: '2026-10-26T08:09:12Z'
  }
];

export const INITIAL_GOLDEN_DATASET: GoldenDatasetItem[] = [
  {
    id: 'gold_1',
    runId: 'run-hitl-103',
    title: 'Customer Data Processing Addendum (DPA) AI Retention Amendment',
    channel: 'legal_notice',
    promptContext: 'Regulatory legal notice regarding prompt data retention and EU AI Act Art 14.',
    aiOriginalDraft: `Dear Customer,\n\nWe are revising our AI Data Governance terms. We do not store your data for more than 30 days unless you opt in. Reviewers might see your prompts if needed for troubleshooting.\n\nContact us if you have questions.`,
    humanApprovedDraft: `To our valued enterprise partners,\n\nEffective December 1, 2026, LoopGuard is instituting formalized amendments to our Data Processing Addendum (DPA) to align with EU Artificial Intelligence Act (AIA) Article 14 human oversight standards.\n\nCore Guarantees:\n1. Zero-Retention Default: Enterprise prompt payloads and generated drafts are processed entirely in-memory with zero persistent training retention on foundational base models.\n2. Isolated Tenant Closed-Loop: Reviewer correction logs (Golden Dataset) remain strictly segregated within your dedicated sovereign encryption enclave.\n3. Continuous Human Oversight: Mandatory HITL checkpoints remain hard-enforced for all financial, regulatory, and public brand dispatch channels.\n\nShould your compliance officers require an updated counter-signed DPA or SOC-2 Type II audit report, please submit a request to dpo@loopguard.internal.`,
    charDelta: 724,
    categories: ['Legal Liability', 'Missing Disclaimer', 'Tone Calibration'],
    reviewerNotes: 'AI initially used conversational shorthand and omitted statutory articles. Injected formal legal structure, Zero-Retention guarantees, and official DPO escalation address.',
    reviewerName: 'Sarah Vance, Esq.',
    recordedAt: '2026-10-26T07:45:12Z',
    diffSummary: 'Replaced casual tone with structured 3-point legal guarantee citing EU AI Act Art 14.'
  },
  {
    id: 'gold_2',
    runId: 'run-hitl-094',
    title: 'Enterprise Renewal Discount Offer - Cloud Health Monitoring',
    channel: 'email',
    promptContext: 'Incentivize 2-year renewal for client with $50k ARR considering competitor migration.',
    aiOriginalDraft: `Hi Mark,\n\nWe really want to keep you! We can offer you 30% off your entire enterprise renewal if you sign today. Just let me know and I will apply the credits right away.`,
    humanApprovedDraft: `Hi Mark,\n\nFollowing our review of your infrastructure scaling milestones over the past 18 months, we would like to structure an extended partnership agreement for your 2027 renewal.\n\nSubject to a 24-month commitment, we are authorized to extend a 15% multi-year discount across your primary cluster tier, alongside complimentary premium 24/7 designated TAM support (valued at $12,000 annually).\n\nThis pricing structure remains valid through November 30, 2026. Let us know if your procurement team would like to review the revised order schedule.`,
    charDelta: 310,
    categories: ['Financial & Discount Guardrail', 'Tone Calibration'],
    reviewerNotes: 'AI hallucinated an unauthorized 30% discount without manager sign-off. Corrected to 15% with TAM inclusion and explicit expiry date per Sales Governance Policy #4.',
    reviewerName: 'Marcus Chen',
    recordedAt: '2026-10-25T16:20:00Z',
    diffSummary: 'Corrected over-generous 30% cut to approved 15% + TAM support bundle with expiration date.'
  },
  {
    id: 'gold_3',
    runId: 'run-hitl-088',
    title: 'Medical AI Assistant Diagnostic Disclaimer for Clinical Summary App',
    channel: 'support_ticket',
    promptContext: 'Summary report generated for a patient post-telehealth consultation.',
    aiOriginalDraft: `Patient reports mild headaches. The diagnosis suggests tension headaches, and you should take 400mg ibuprofen every 6 hours until pain subsides.`,
    humanApprovedDraft: `Clinical Note Summary:\nPatient reports recurrent mild cephalalgia (tension-type characteristics) without red flag neurological symptoms.\n\n⚠️ MANDATORY MEDICAL DISCLAIMER: This automated clinical summary was prepared with AI assistance for provider review. It does NOT constitute an independent medical prescription or definitive diagnosis. Consult your licensed physician before initiating any pharmacotherapy. In the event of sudden severe onset or fever, seek emergency medical care immediately.`,
    charDelta: 380,
    categories: ['Missing Disclaimer', 'Legal Liability', 'Factual Inaccuracy'],
    reviewerNotes: 'AI generated direct pharmaceutical dosage advice ("take 400mg ibuprofen") which breaches FDA Software as Medical Device (SaMD) Class II guidelines. Replaced with mandatory physician disclaimer.',
    reviewerName: 'Sarah Vance, Esq.',
    recordedAt: '2026-10-25T11:05:00Z',
    diffSummary: 'Removed unlicensed dosage instruction and appended statutory physician review disclaimer.'
  }
];

export const PRESET_SCENARIOS = [
  {
    id: 'preset_refund',
    title: 'VIP Financial Refund & Disputed Service Billing',
    channel: 'support_ticket' as const,
    triggerSource: 'Zendesk VIP Escalation #91024 (Stripe Merchant Sync Error)',
    targetAudience: 'Chief Financial Officer / Procurement Director',
    brandTone: 'Humble, highly accountable, transparent with transaction identifiers',
    constraints: 'Specify $650.00 refund back to AMEX ending in 4102. State 3-5 business days banking clearance. Provide 15% goodwill coupon with 90-day expiry. No generic apologies.',
    context: 'Customer was billed for 5 extra seats due to an API webhook retry loop. Total ARR is $120,000. Customer sent a direct email to our CEO.'
  },
  {
    id: 'preset_launch',
    title: 'Autonomous Agent Interruption & Step Functions Launch',
    channel: 'social_linkedin' as const,
    triggerSource: 'Product Management Launch Milestone (LoopGuard Engine v2.5)',
    targetAudience: 'Engineering Leaders, Compliance Directors, AI Developers',
    brandTone: 'Thoughtful, technically authoritative, anti-slop, data-backed',
    constraints: 'Reference the 19% human correction dataset metric. Explain how asynchronous task tokens solve the waiting problem. Keep under 250 words. Include call to action.',
    context: 'Demonstrating that the future of enterprise AI is not unmonitored autonomy, but continuous human oversight and calibration.'
  },
  {
    id: 'preset_legal',
    title: 'Annual AI Model Transparency & Privacy Addendum',
    channel: 'legal_notice' as const,
    triggerSource: 'Chief Information Security Officer & Legal Compliance Audit',
    targetAudience: 'Enterprise Tenant Administrators & Data Protection Officers',
    brandTone: 'Formal, unambiguous, regulatory-grade compliance precision',
    constraints: 'Cite EU AI Act Article 14 (Human Oversight) and SOC-2 Type II Section CC6.1. Reiterate zero-training retention on raw prompt content.',
    context: 'Annual contractual notification regarding our isolated tenant architecture and customer review data protections.'
  },
  {
    id: 'preset_health',
    title: 'Clinical Patient Health Advisory & Telehealth Follow-up',
    channel: 'email' as const,
    triggerSource: 'HealthTech Provider EHR System Integration Trigger',
    targetAudience: 'Patient following routine laboratory wellness panel',
    brandTone: 'Compassionate, clear, medically responsible, protective',
    constraints: 'Include mandatory FDA SaMD disclaimer. Never prescribe specific medication dosages without human doctor co-signature. Provide urgent clinic hotline.',
    context: 'Lab results are normal with borderline Vitamin D. Patient requested advice on fatigue.'
  },
  {
    id: 'preset_faq',
    title: 'Standard Knowledge Base: SSO Configuration Walkthrough',
    channel: 'email' as const,
    triggerSource: 'Self-serve Help Center Inbound Form',
    targetAudience: 'IT Administrator setting up Okta SAML 2.0',
    brandTone: 'Direct, step-by-step, concise, developer-friendly',
    constraints: 'Provide 3 actionable steps to copy SAML metadata URL and upload X.509 certificate. No fluff.',
    context: 'Routine technical inquiry with zero financial or legal implications.'
  }
];
