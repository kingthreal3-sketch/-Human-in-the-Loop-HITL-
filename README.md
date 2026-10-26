# LoopGuard — Human-in-the-Loop (HITL) AI Content Generation Studio

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new)
![Node Version](https://img.shields.io/badge/Node.js-18%2B%20%7C%2020%2B-brightgreen)
![Gemini API](https://img.shields.io/badge/Gemini%20API-gemini--3.8--flash-blue)
![Vite + Express](https://img.shields.io/badge/Full--Stack-Express%20%2B%20Vite%20%2B%20React-purple)
![License](https://img.shields.io/badge/License-Apache--2.0-orange)

**LoopGuard** is an enterprise-grade **Human-in-the-Loop (HITL)** AI workflow platform. It inserts a mandatory, meaningful human approval checkpoint before AI-generated content is published externally, converting reviewer actions into an active **data source and quality control loop** for continuous model optimization.

---

## ⚡ Quickstart in GitHub Codespaces

You can run this entire application directly inside your browser with **zero local setup** using GitHub Codespaces.

### Method 1: One-Click Launch via GitHub
1. Navigate to your repository on GitHub.
2. Click the green **Code** button at the top right.
3. Select the **Codespaces** tab and click **Create codespace on main**.
4. GitHub Codespaces will automatically:
   - Spin up a cloud Linux container (Node.js 20).
   - Run `npm install` automatically via `.devcontainer/devcontainer.json`.
   - Forward **Port 3000** for the web application.

### Method 2: Launch Dev Server in Codespaces Terminal
Once your Codespace terminal appears, run:

```bash
# 1. Copy the example environment file
cp .env.example .env

# 2. (Optional) Set your Gemini API key in .env or Codespaces Secrets
# If omitted, LoopGuard automatically runs in high-fidelity offline simulation mode!

# 3. Start the dev server
npm run dev
```

When the dev server starts on `http://0.0.0.0:3000`, Codespaces will show a pop-up saying **"Application running on port 3000"**. Click **Open in Browser** to view the app!

---

## 💻 Terminal Commands to Run (Local or Remote)

Follow these exact terminal commands to clone, configure, build, and run LoopGuard on any Linux, macOS, or Windows machine.

### 1. Prerequisites
- **Node.js**: v18.0.0 or v20.0.0+ (`node -v`)
- **npm** v9+ or **bun** / **pnpm**

### 2. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/loopguard-hitl-studio.git

# Enter project directory
cd loopguard-hitl-studio

# Install dependencies
npm install
```

### 3. Configure Environment Variables

```bash
# Copy template
cp .env.example .env
```

Open `.env` in your editor:
```env
# GEMINI_API_KEY: Optional for live Google Gen AI calls.
# If omitted or left as default, LoopGuard runs seamlessly with its built-in realistic offline engine.
GEMINI_API_KEY="your_actual_gemini_api_key_here"

# PORT: Defaults to 3000
PORT=3000
```

### 4. Run the Full-Stack Development Server

```bash
npm run dev
```
> Starts the Express API backend and Vite client on **`http://localhost:3000`** with hot module compilation via `tsx server.ts`.

### 5. Build for Production

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

### 6. Run Type-Check & Linting

```bash
npm run lint
```

---

## 🧩 Core HITL Architecture

```
[Inbound Trigger] 
       │ (Zendesk Ticket / LinkedIn Draft / Legal Notice)
       ▼
[Gemini 3.8 Flash Agent] ──► [Risk Analyzer (0-100 Score & Policy Checklist)]
       │
       ▼
[Pause Execution & Asynchronous Token] ──► [Dispatches Slack & Email Alert]
       │
       ▼
[Reviewer Station & Diff Viewer] ◄───► [Revision Loop: "Generate-Revise-Regenerate"]
       │
       ▼
[Cryptographic Sign-off (SHA-256)] ──► [External Dispatch (Email/Social/Zendesk)]
       │
       ▼
[19% Golden Dataset Closed Loop] ──► [Prompt Guardrail Auto-Tuner & JSONL Export]
```

### 1. State Persistence & Asynchronous Waiting
Reviewers don't sit waiting in front of a screen. LoopGuard serializes the state (original request, AI draft, constraints) and emits an **AWS Step Functions / n8n-style interruption token** (`itok_stepfn_...`). Reviewers receive actionable Slack Block Kit cards or email links to pick up the task hours later.

### 2. "Sufficient Decision Information" Against Rubber-Stamping
Avoids mindless "Agree" clicks by presenting:
- **Decision Context Deck**: Original customer ticket, audience, strict constraints, and brand voice rules.
- **Side-by-Side Word Diff**: Real-time word-level diffing showing exact human additions (emerald green) and deletions (rose strike-through).
- **AI Reasoning & Citations**: Direct visibility into why the model chose specific phrasing, along with verified policy checks.
- **Target Channel Simulation**: Real-world previews for Gmail, LinkedIn post cards, and legal bulletins.

### 3. The Revision Loop ("Generate-Revise-Regenerate")
Rejection is **not** termination. Reviewers can click **"Request AI Revision"**, provide specific feedback (e.g., *"Make tone warmer, acknowledge 3-year tenure, add promo code"*), and Gemini regenerates draft version **v2 → v3** with an executive changelog.

### 4. The 19% Golden Dataset & Closed-Loop Learning
Based on production clinical/financial AI metrics (~81% direct pass, **19% human corrected**):
- Every human edit is automatically logged into the **Golden Dataset**.
- Classifies errors (*Tone Mismatch, Financial/Discount Guardrail, Missing Disclaimer, Legal Liability*).
- **Auto-Synthesize Guardrails**: Calls Gemini to analyze recurring human corrections and synthesize new system prompt rules.
- **Export JSONL**: 1-click download of fine-tuning dataset formatted for Gemini and OpenAI models.

---

## 📂 Project Structure

```
├── .devcontainer/
│   └── devcontainer.json   # GitHub Codespaces container & port forwarding
├── server.ts               # Express full-stack backend with Gemini 3.8 Flash API
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Navigation & active reviewer persona switcher
│   │   ├── WorkflowVisualizer.tsx  # Interactive architectural flowchart
│   │   ├── ReviewStation.tsx       # Core HITL review terminal, live editor & diff
│   │   ├── ReviewQueue.tsx         # Active queue with risk badges & SLA timers
│   │   ├── GoldenDatasetView.tsx   # 19% correction dataset & prompt auto-tuner
│   │   ├── RiskPolicyConfigView.tsx# Risk thresholds & notification policies
│   │   ├── TriggerModal.tsx        # Presets & custom inbound generator
│   │   ├── NotificationModal.tsx   # Slack Block Kit & email notification preview
│   │   └── AuditTrailModal.tsx     # Immutable cryptographic event-sourced ledger
│   ├── data/
│   │   └── seedData.ts     # Realistic scenarios, reviewer profiles, golden seed data
│   ├── utils/
│   │   └── diff.ts         # LCS word-level diff calculator & formatting
│   ├── types.ts            # TypeScript definitions
│   ├── App.tsx             # Root workflow orchestrator
│   ├── main.tsx            # React 19 entry point
│   └── index.css           # Tailwind CSS styles
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔌 API Endpoints (Backend in `server.ts`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/generate-content` | Generates initial draft, AI reasoning, policy checklist, and risk tier score (0-100) via Gemini 3.8 Flash. |
| `POST` | `/api/revise-content` | Executes the **Revision Loop**: takes reviewer feedback and previous draft, returning a regenerated draft with a change summary. |
| `POST` | `/api/synthesize-golden-rules` | Analyzes all logged reviewer diffs and synthesizes copyable system prompt guardrails. |

---

## 🛡️ License

Apache-2.0 License.
