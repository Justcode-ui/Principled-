import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "usage", label: "Usage Standards", icon: "⚙️" },
  { id: "privacy", label: "Privacy & Confidentiality", icon: "🔒" },
  { id: "quality", label: "Quality Control", icon: "✓" },
  { id: "ethics", label: "Ethics Framework", icon: "⚖️" },
  { id: "disclosure", label: "Disclosure & Attribution", icon: "📢" },
  { id: "review", label: "Review & Export", icon: "📄" },
];

const USAGE_CONTEXTS = [
  { id: "writing", label: "Writing & Drafting", desc: "Emails, reports, articles" },
  { id: "research", label: "Research & Analysis", desc: "Summarizing, synthesizing" },
  { id: "coding", label: "Code & Technical Work", desc: "Scripts, debugging" },
  { id: "creative", label: "Creative Projects", desc: "Brainstorming, ideation" },
  { id: "decision", label: "Decision Support", desc: "Weighing options, advice" },
  { id: "personal", label: "Personal Reflection", desc: "Journaling, planning" },
];

const DISCLOSURE_CONTEXTS = [
  { id: "internal", label: "Internal Work Docs", example: "Team memos, notes" },
  { id: "client", label: "Client Deliverables", example: "Reports, proposals" },
  { id: "public", label: "Public Content", example: "Blog posts, articles" },
  { id: "academic", label: "Academic Submissions", example: "Papers, assignments" },
  { id: "creative_pub", label: "Published Creative Work", example: "Fiction, art" },
  { id: "social", label: "Social Media", example: "Posts, threads" },
];

const ETHICAL_ISSUES = [
  "Bias amplification in outputs",
  "Intellectual property & copyright",
  "Misinformation / hallucination risk",
  "Data privacy for third parties",
  "Environmental impact of AI compute",
  "Labor displacement concerns",
  "Dependency & deskilling",
  "Lack of transparency with audiences",
];

const DISCLOSURE_LEVELS = {
  none: { label: "No disclosure needed", color: "#4ade80" },
  light: { label: "Brief mention", color: "#facc15" },
  standard: { label: "Standard statement", color: "#fb923c" },
  detailed: { label: "Detailed attribution", color: "#f87171" },
};

const DEFAULT_POLICY = {
  name: "",
  role: "",
  date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  usageContexts: {},
  sensitiveCategories: [],
  dataRules: "",
  qualityChecks: [],
  humanReviewThreshold: "medium",
  ethicalIssues: [],
  decisionFramework: "",
  stakeholders: "",
  disclosureByContext: {},
  attributionTemplate: "",
  detailedDisclosureCriteria: [],
  customNotes: "",
};

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    style={{
      width: 44, height: 24, borderRadius: 12,
      background: checked ? "#7c3aed" : "#3f3f46",
      border: "none", cursor: "pointer", position: "relative",
      transition: "background 0.2s", flexShrink: 0,
    }}
  >
    <div style={{
      width: 18, height: 18, borderRadius: "50%", background: "#fff",
      position: "absolute", top: 3, left: checked ? 23 : 3,
      transition: "left 0.2s",
    }} />
  </button>
);

const Chip = ({ label, active, onClick, color }) => (
  <button onClick={onClick} style={{
    padding: "6px 14px", borderRadius: 20, fontSize: 13, fontFamily: "inherit",
    border: active ? `1.5px solid ${color || "#7c3aed"}` : "1.5px solid #3f3f46",
    background: active ? `${color || "#7c3aed"}22` : "transparent",
    color: active ? (color || "#a78bfa") : "#a1a1aa",
    cursor: "pointer", transition: "all 0.15s", fontWeight: active ? 600 : 400,
  }}>{label}</button>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#18181b", border: "1px solid #27272a",
    borderRadius: 12, padding: "20px 24px", ...style
  }}>{children}</div>
);

const Label = ({ children, sub }) => (
  <div style={{ marginBottom: sub ? 8 : 12 }}>
    <div style={{ fontSize: sub ? 13 : 15, fontWeight: 600, color: sub ? "#a1a1aa" : "#e4e4e7", fontFamily: "'DM Sans', sans-serif" }}>{children}</div>
  </div>
);

const TextArea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} rows={rows}
    style={{
      width: "100%", background: "#09090b", border: "1px solid #3f3f46",
      borderRadius: 8, padding: "10px 14px", color: "#e4e4e7",
      fontSize: 14, fontFamily: "'DM Sans', sans-serif", resize: "vertical",
      outline: "none", boxSizing: "border-box", lineHeight: 1.6,
    }}
  />
);

const Input = ({ value, onChange, placeholder }) => (
  <input
    value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: "100%", background: "#09090b", border: "1px solid #3f3f46",
      borderRadius: 8, padding: "10px 14px", color: "#e4e4e7",
      fontSize: 14, fontFamily: "'DM Sans', sans-serif",
      outline: "none", boxSizing: "border-box",
    }}
  />
);

function UsageSection({ policy, setPolicy }) {
  const toggle = (id) => {
    const c = { ...policy.usageContexts };
    c[id] = !c[id];
    setPolicy(p => ({ ...p, usageContexts: c }));
  };

  const ALLOWED_LEVELS = [
    { id: "unrestricted", label: "Unrestricted use", color: "#4ade80" },
    { id: "review", label: "Use with human review", color: "#facc15" },
    { id: "limited", label: "Limited / experimental", color: "#fb923c" },
    { id: "prohibited", label: "Not permitted", color: "#f87171" },
  ];

  const setLevel = (id, level) => {
    setPolicy(p => ({ ...p, usageContexts: { ...p.usageContexts, [id]: level } }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f4f4f5", margin: 0, fontFamily: "'DM Serif Display', serif" }}>Usage Standards</h2>
        <p style={{ color: "#71717a", fontSize: 14, marginTop: 6, marginBottom: 0 }}>Define when and how you'll work with AI across different contexts.</p>
      </div>

      <Card>
        <Label>Your Name & Role</Label>
        <div style={{ display: "flex", gap: 12 }}>
          <Input value={policy.name} onChange={v => setPolicy(p => ({ ...p, name: v }))} placeholder="Your name" />
          <Input value={policy.role} onChange={v => setPolicy(p => ({ ...p, role: v }))} placeholder="Your role or field" />
        </div>
      </Card>

      <Card>
        <Label>Usage level by context</Label>
        <p style={{ color: "#71717a", fontSize: 13, marginTop: -4, marginBottom: 16 }}>For each context, choose your permitted level of AI use.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {ALLOWED_LEVELS.map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a1a1aa" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {USAGE_CONTEXTS.map(ctx => (
            <div key={ctx.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", background: "#09090b", borderRadius: 8,
              border: "1px solid #27272a"
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e4e4e7" }}>{ctx.label}</div>
                <div style={{ fontSize: 12, color: "#71717a" }}>{ctx.desc}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {ALLOWED_LEVELS.map(l => (
                  <button key={l.id} onClick={() => setLevel(ctx.id, l.id)} style={{
                    width: 28, height: 28, borderRadius: "50%", border: "2px solid",
                    borderColor: policy.usageContexts[ctx.id] === l.id ? l.color : "#3f3f46",
                    background: policy.usageContexts[ctx.id] === l.id ? `${l.color}33` : "transparent",
                    cursor: "pointer", transition: "all 0.15s",
                  }} title={l.label} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Label>General principles for AI use</Label>
        <TextArea
          value={policy.dataRules}
          onChange={v => setPolicy(p => ({ ...p, dataRules: v }))}
          placeholder="e.g. I will use AI as a thought partner, not a replacement for my judgment. I'll always verify factual claims before publishing..."
          rows={4}
        />
      </Card>
    </div>
  );
}

function PrivacySection({ policy, setPolicy }) {
  const SENSITIVE = [
    "Client / customer PII", "Financial records", "Medical / health data",
    "Legal matters", "Personnel / HR info", "Proprietary business data",
    "Unpublished research", "Personal relationships", "Authentication credentials",
    "Minor's information",
  ];

  const toggle = (item) => {
    setPolicy(p => ({
      ...p,
      sensitiveCategories: p.sensitiveCategories.includes(item)
        ? p.sensitiveCategories.filter(x => x !== item)
        : [...p.sensitiveCategories, item]
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f4f4f5", margin: 0, fontFamily: "'DM Serif Display', serif" }}>Privacy & Confidentiality</h2>
        <p style={{ color: "#71717a", fontSize: 14, marginTop: 6, marginBottom: 0 }}>Establish clear boundaries for sensitive and confidential information.</p>
      </div>

      <Card>
        <Label>Categories I will NOT share with AI systems</Label>
        <p style={{ color: "#71717a", fontSize: 13, marginTop: -4, marginBottom: 16 }}>Select all that apply to your work and personal life.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SENSITIVE.map(item => (
            <Chip
              key={item} label={item}
              active={policy.sensitiveCategories.includes(item)}
              onClick={() => toggle(item)}
              color="#f87171"
            />
          ))}
        </div>
      </Card>

      <Card>
        <Label>My data handling rules</Label>
        <TextArea
          value={policy.dataRules || ""}
          onChange={v => setPolicy(p => ({ ...p, dataRules: v }))}
          placeholder="e.g. I will anonymize client names before using examples in prompts. I will not paste contracts or legal documents into AI chat interfaces. I will check my organization's AI usage policy before using work systems..."
          rows={5}
        />
      </Card>

      <Card style={{ borderColor: "#7c3aed44", background: "#7c3aed0a" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ fontSize: 22 }}>💡</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", marginBottom: 4 }}>Privacy test to apply before sharing</div>
            <div style={{ fontSize: 13, color: "#71717a", lineHeight: 1.7 }}>
              Before entering any information, ask: Would the person this information is about consent to it being processed by a third-party AI system? If uncertain, anonymize or omit.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function QualitySection({ policy, setPolicy }) {
  const CHECKS = [
    "Verify factual claims independently",
    "Review for logical consistency",
    "Check tone and voice match my own",
    "Confirm no hallucinated sources/citations",
    "Test code before deploying",
    "Review for unintended bias",
    "Ensure completeness — nothing important omitted",
    "Have a trusted peer review high-stakes work",
  ];

  const THRESHOLDS = [
    { id: "low", label: "Low stakes", desc: "Personal notes, brainstorming" },
    { id: "medium", label: "Medium stakes", desc: "Internal documents, team comms" },
    { id: "high", label: "High stakes", desc: "Client work, public content, decisions" },
    { id: "always", label: "Always review", desc: "Every AI-assisted output" },
  ];

  const toggleCheck = (check) => {
    setPolicy(p => ({
      ...p,
      qualityChecks: p.qualityChecks.includes(check)
        ? p.qualityChecks.filter(x => x !== check)
        : [...p.qualityChecks, check]
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f4f4f5", margin: 0, fontFamily: "'DM Serif Display', serif" }}>Quality Control</h2>
        <p style={{ color: "#71717a", fontSize: 14, marginTop: 6, marginBottom: 0 }}>Define how you'll maintain standards for AI-assisted work.</p>
      </div>

      <Card>
        <Label>My quality checklist for AI-assisted work</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CHECKS.map(check => (
            <label key={check} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "8px 12px", borderRadius: 8, background: policy.qualityChecks.includes(check) ? "#7c3aed11" : "transparent", transition: "background 0.15s" }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                border: `1.5px solid ${policy.qualityChecks.includes(check) ? "#7c3aed" : "#3f3f46"}`,
                background: policy.qualityChecks.includes(check) ? "#7c3aed" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s", cursor: "pointer",
              }} onClick={() => toggleCheck(check)}>
                {policy.qualityChecks.includes(check) && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: 14, color: "#d4d4d8" }}>{check}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <Label>Require human review when stakes are...</Label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {THRESHOLDS.map(t => (
            <button key={t.id} onClick={() => setPolicy(p => ({ ...p, humanReviewThreshold: t.id }))} style={{
              padding: "12px 16px", borderRadius: 10, border: `1.5px solid`,
              borderColor: policy.humanReviewThreshold === t.id ? "#7c3aed" : "#27272a",
              background: policy.humanReviewThreshold === t.id ? "#7c3aed1a" : "#09090b",
              cursor: "pointer", textAlign: "left", flex: "1 1 140px",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: policy.humanReviewThreshold === t.id ? "#a78bfa" : "#e4e4e7" }}>{t.label}</div>
              <div style={{ fontSize: 12, color: "#71717a", marginTop: 2 }}>{t.desc}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <Label>Additional quality standards</Label>
        <TextArea
          value={policy.customNotes || ""}
          onChange={v => setPolicy(p => ({ ...p, customNotes: v }))}
          placeholder="e.g. For any client-facing document, I will rewrite AI-generated sections in my own voice. I will keep track of how much of any given deliverable is AI-assisted..."
          rows={4}
        />
      </Card>
    </div>
  );
}

function EthicsSection({ policy, setPolicy }) {
  const toggleIssue = (issue) => {
    setPolicy(p => ({
      ...p,
      ethicalIssues: p.ethicalIssues.includes(issue)
        ? p.ethicalIssues.filter(x => x !== issue)
        : [...p.ethicalIssues, issue]
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f4f4f5", margin: 0, fontFamily: "'DM Serif Display', serif" }}>Ethics Framework</h2>
        <p style={{ color: "#71717a", fontSize: 14, marginTop: 6, marginBottom: 0 }}>Identify ethical concerns and build your decision-making framework.</p>
      </div>

      <Card>
        <Label>Ethical issues most relevant to my work</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ETHICAL_ISSUES.map(issue => (
            <Chip
              key={issue} label={issue}
              active={policy.ethicalIssues.includes(issue)}
              onClick={() => toggleIssue(issue)}
              color="#fb923c"
            />
          ))}
        </div>
      </Card>

      <Card>
        <Label>My ethical decision framework</Label>
        <p style={{ color: "#71717a", fontSize: 13, marginTop: -4, marginBottom: 12 }}>When facing an ethical dilemma about AI use, I will ask myself...</p>
        <TextArea
          value={policy.decisionFramework}
          onChange={v => setPolicy(p => ({ ...p, decisionFramework: v }))}
          placeholder={`e.g.\n1. Would I be comfortable if everyone I work with knew I used AI for this?\n2. Does this use benefit or harm the people affected by the output?\n3. Am I outsourcing a judgment call I should own?\n4. Is this use consistent with my professional standards and codes of conduct?`}
          rows={6}
        />
      </Card>

      <Card>
        <Label>Stakeholders affected by my AI use</Label>
        <p style={{ color: "#71717a", fontSize: 13, marginTop: -4, marginBottom: 12 }}>Consider whose interests and perspectives should inform your AI decisions.</p>
        <TextArea
          value={policy.stakeholders}
          onChange={v => setPolicy(p => ({ ...p, stakeholders: v }))}
          placeholder="e.g. Clients who trust my independent judgment; colleagues whose work I collaborate on; readers or audiences who consume my content; people whose data I might reference; junior colleagues I might influence..."
          rows={4}
        />
      </Card>
    </div>
  );
}

function DisclosureSection({ policy, setPolicy }) {
  const setLevel = (ctxId, level) => {
    setPolicy(p => ({ ...p, disclosureByContext: { ...p.disclosureByContext, [ctxId]: level } }));
  };

  const toggleCriteria = (c) => {
    setPolicy(p => ({
      ...p,
      detailedDisclosureCriteria: p.detailedDisclosureCriteria.includes(c)
        ? p.detailedDisclosureCriteria.filter(x => x !== c)
        : [...p.detailedDisclosureCriteria, c]
    }));
  };

  const CRITERIA = [
    "AI generated the core argument or conclusion",
    "More than 50% of content is AI-drafted",
    "Audience has a reasonable expectation of unassisted work",
    "Work involves professional advice (legal, medical, financial)",
    "Content will be widely distributed or influential",
    "Subject matter is sensitive or high-stakes",
  ];

  const TEMPLATES = {
    light: "Written with AI assistance.",
    standard: "This [document/post/report] was developed with the assistance of AI tools. All content has been reviewed and edited by [Name].",
    detailed: "This work was created with significant AI collaboration. AI tools were used for [specific tasks]. The author takes full responsibility for accuracy and final judgments expressed herein. Questions about the process can be directed to [contact].",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f4f4f5", margin: 0, fontFamily: "'DM Serif Display', serif" }}>Disclosure & Attribution</h2>
        <p style={{ color: "#71717a", fontSize: 14, marginTop: 6, marginBottom: 0 }}>Determine how and when you'll be transparent about AI collaboration.</p>
      </div>

      <Card>
        <Label>Disclosure level by context</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {Object.entries(DISCLOSURE_LEVELS).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a1a1aa" }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: v.color }} />
              {v.label}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {DISCLOSURE_CONTEXTS.map(ctx => (
            <div key={ctx.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", background: "#09090b", borderRadius: 8,
              border: "1px solid #27272a", gap: 12
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e4e4e7" }}>{ctx.label}</div>
                <div style={{ fontSize: 12, color: "#71717a" }}>{ctx.example}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {Object.entries(DISCLOSURE_LEVELS).map(([k, v]) => (
                  <button key={k} onClick={() => setLevel(ctx.id, k)} title={v.label} style={{
                    width: 26, height: 26, borderRadius: 6, border: "1.5px solid",
                    borderColor: policy.disclosureByContext[ctx.id] === k ? v.color : "#3f3f46",
                    background: policy.disclosureByContext[ctx.id] === k ? `${v.color}33` : "transparent",
                    cursor: "pointer", transition: "all 0.15s",
                  }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Label>When I'll use detailed disclosure</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CRITERIA.map(c => (
            <label key={c} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "6px 8px", borderRadius: 6 }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                border: `1.5px solid ${policy.detailedDisclosureCriteria.includes(c) ? "#7c3aed" : "#3f3f46"}`,
                background: policy.detailedDisclosureCriteria.includes(c) ? "#7c3aed" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }} onClick={() => toggleCriteria(c)}>
                {policy.detailedDisclosureCriteria.includes(c) && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: 14, color: "#d4d4d8" }}>{c}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <Label>My attribution template</Label>
        <TextArea
          value={policy.attributionTemplate}
          onChange={v => setPolicy(p => ({ ...p, attributionTemplate: v }))}
          placeholder="Write your standard disclosure statement here..."
          rows={3}
        />
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: "#71717a", marginBottom: 8 }}>Quick templates:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(TEMPLATES).map(([k, v]) => (
              <button key={k} onClick={() => setPolicy(p => ({ ...p, attributionTemplate: v }))} style={{
                padding: "6px 12px", borderRadius: 6, border: "1px solid #3f3f46",
                background: "#09090b", color: "#a1a1aa", cursor: "pointer",
                fontSize: 12, fontFamily: "inherit", textTransform: "capitalize",
              }}>{k}</button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function ReviewSection({ policy }) {
  const LEVEL_COLORS = { unrestricted: "#4ade80", review: "#facc15", limited: "#fb923c", prohibited: "#f87171" };
  const LEVEL_LABELS = { unrestricted: "Unrestricted", review: "Review required", limited: "Limited", prohibited: "Not permitted" };
  const DISC_COLORS = { none: "#4ade80", light: "#facc15", standard: "#fb923c", detailed: "#f87171" };

  const generateText = () => {
    const lines = [];
    lines.push(`PERSONAL AI POLICY`);
    lines.push(`${policy.name || "[Your Name]"}${policy.role ? ` — ${policy.role}` : ""}`);
    lines.push(`Effective: ${policy.date}`);
    lines.push(`\n${"─".repeat(50)}`);

    lines.push(`\n1. USAGE STANDARDS`);
    USAGE_CONTEXTS.forEach(ctx => {
      const level = policy.usageContexts[ctx.id];
      if (level) lines.push(`  ${ctx.label}: ${LEVEL_LABELS[level] || level}`);
    });

    if (policy.dataRules) {
      lines.push(`\n  General principles:\n  ${policy.dataRules}`);
    }

    if (policy.sensitiveCategories.length > 0) {
      lines.push(`\n2. PRIVACY & CONFIDENTIALITY`);
      lines.push(`  Will NOT share with AI systems:\n  ${policy.sensitiveCategories.join(", ")}`);
    }

    if (policy.qualityChecks.length > 0) {
      lines.push(`\n3. QUALITY CONTROL`);
      lines.push(`  Quality checklist:\n${policy.qualityChecks.map(c => `  • ${c}`).join("\n")}`);
      if (policy.humanReviewThreshold) lines.push(`  Human review required for: ${policy.humanReviewThreshold}-stakes work and above`);
    }

    if (policy.ethicalIssues.length > 0 || policy.decisionFramework) {
      lines.push(`\n4. ETHICS FRAMEWORK`);
      if (policy.ethicalIssues.length > 0) lines.push(`  Key ethical considerations:\n  ${policy.ethicalIssues.join(", ")}`);
      if (policy.decisionFramework) lines.push(`\n  Decision framework:\n  ${policy.decisionFramework}`);
      if (policy.stakeholders) lines.push(`\n  Affected stakeholders:\n  ${policy.stakeholders}`);
    }

    lines.push(`\n5. DISCLOSURE & ATTRIBUTION`);
    DISCLOSURE_CONTEXTS.forEach(ctx => {
      const level = policy.disclosureByContext[ctx.id];
      if (level) lines.push(`  ${ctx.label}: ${DISCLOSURE_LEVELS[level]?.label || level}`);
    });
    if (policy.attributionTemplate) lines.push(`\n  Standard statement:\n  "${policy.attributionTemplate}"`);
    if (policy.detailedDisclosureCriteria.length > 0) {
      lines.push(`\n  Detailed disclosure when:\n${policy.detailedDisclosureCriteria.map(c => `  • ${c}`).join("\n")}`);
    }

    return lines.join("\n");
  };

  const completeness = [
    policy.name,
    Object.keys(policy.usageContexts).length > 0,
    policy.sensitiveCategories.length > 0,
    policy.qualityChecks.length > 0,
    policy.ethicalIssues.length > 0,
    policy.decisionFramework,
    Object.keys(policy.disclosureByContext).length > 0,
    policy.attributionTemplate,
  ].filter(Boolean).length;

  const pct = Math.round((completeness / 8) * 100);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateText());
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f4f4f5", margin: 0, fontFamily: "'DM Serif Display', serif" }}>Review & Export</h2>
        <p style={{ color: "#71717a", fontSize: 14, marginTop: 6, marginBottom: 0 }}>Your personal AI policy at a glance.</p>
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Label>Policy completeness</Label>
          <span style={{ fontSize: 14, fontWeight: 700, color: pct >= 75 ? "#4ade80" : pct >= 50 ? "#facc15" : "#f87171" }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: "#27272a", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct >= 75 ? "#4ade80" : pct >= 50 ? "#facc15" : "#f87171", borderRadius: 3, transition: "width 0.4s" }} />
        </div>
      </Card>

      <Card style={{ background: "#09090b", fontFamily: "'IBM Plex Mono', monospace" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#71717a", textTransform: "uppercase", letterSpacing: 1 }}>Policy document</div>
          <button onClick={copyToClipboard} style={{
            padding: "6px 14px", borderRadius: 6, border: "1px solid #3f3f46",
            background: "#18181b", color: "#a1a1aa", cursor: "pointer",
            fontSize: 12, fontFamily: "inherit",
          }}>Copy text</button>
        </div>
        <pre style={{ fontSize: 12, color: "#d4d4d8", whiteSpace: "pre-wrap", lineHeight: 1.8, margin: 0, overflowX: "auto" }}>
          {generateText()}
        </pre>
      </Card>

      <Card style={{ borderColor: "#7c3aed44", background: "#7c3aed0a" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", marginBottom: 8 }}>Living document reminder</div>
        <div style={{ fontSize: 13, color: "#71717a", lineHeight: 1.7 }}>
          AI capabilities and norms evolve rapidly. Plan to revisit this policy at least every 6 months, and update it whenever you take on new responsibilities, join a new organization, or encounter an ethical situation that your current policy doesn't address.
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("usage");
  const [policy, setPolicy] = useState(DEFAULT_POLICY);

  const sectionComponent = {
    usage: <UsageSection policy={policy} setPolicy={setPolicy} />,
    privacy: <PrivacySection policy={policy} setPolicy={setPolicy} />,
    quality: <QualitySection policy={policy} setPolicy={setPolicy} />,
    ethics: <EthicsSection policy={policy} setPolicy={setPolicy} />,
    disclosure: <DisclosureSection policy={policy} setPolicy={setPolicy} />,
    review: <ReviewSection policy={policy} />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #09090b; }
        ::-webkit-scrollbar { width: 6px; } 
        ::-webkit-scrollbar-track { background: #18181b; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 3px; }
        textarea:focus, input:focus { border-color: #7c3aed !important; }
      `}</style>
      <div style={{
        minHeight: "100vh", background: "#09090b",
        fontFamily: "'DM Sans', sans-serif", color: "#e4e4e7",
      }}>
        {/* Header */}
        <div style={{
          padding: "28px 32px 0", maxWidth: 860, margin: "0 auto",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
            <h1 style={{
              fontSize: 28, fontWeight: 700, fontFamily: "'DM Serif Display', serif",
              color: "#f4f4f5", letterSpacing: "-0.5px",
            }}>Personal AI Policy</h1>
            <div style={{ fontSize: 12, color: "#52525b", fontFamily: "'IBM Plex Mono', monospace", paddingBottom: 2 }}>v1.0</div>
          </div>
          <p style={{ fontSize: 14, color: "#71717a", marginBottom: 28 }}>
            Define your standards, boundaries, and values for working with AI.
          </p>

          {/* Nav */}
          <div style={{ display: "flex", gap: 2, borderBottom: "1px solid #27272a", overflowX: "auto" }}>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                padding: "10px 16px", border: "none", background: "transparent",
                color: activeSection === s.id ? "#a78bfa" : "#71717a",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                cursor: "pointer", whiteSpace: "nowrap",
                borderBottom: `2px solid ${activeSection === s.id ? "#7c3aed" : "transparent"}`,
                marginBottom: -1, transition: "all 0.15s",
              }}>
                <span style={{ marginRight: 6 }}>{s.icon}</span>{s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 32px 64px" }}>
          {sectionComponent[activeSection]}

          {/* Navigation buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
            {SECTIONS.findIndex(s => s.id === activeSection) > 0 ? (
              <button onClick={() => {
                const idx = SECTIONS.findIndex(s => s.id === activeSection);
                setActiveSection(SECTIONS[idx - 1].id);
              }} style={{
                padding: "10px 20px", borderRadius: 8, border: "1px solid #3f3f46",
                background: "transparent", color: "#a1a1aa", cursor: "pointer",
                fontFamily: "inherit", fontSize: 14,
              }}>← Back</button>
            ) : <div />}
            {SECTIONS.findIndex(s => s.id === activeSection) < SECTIONS.length - 1 && (
              <button onClick={() => {
                const idx = SECTIONS.findIndex(s => s.id === activeSection);
                setActiveSection(SECTIONS[idx + 1].id);
              }} style={{
                padding: "10px 20px", borderRadius: 8, border: "none",
                background: "#7c3aed", color: "#fff", cursor: "pointer",
                fontFamily: "inherit", fontSize: 14, fontWeight: 600,
              }}>Next →</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
