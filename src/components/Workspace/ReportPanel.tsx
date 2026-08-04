import React from 'react';
import {
  CheckCircle, AlertTriangle, BookOpen, ChevronRight,
  ListOrdered, Beaker, ChevronLeft, Info, Cpu, GraduationCap, ArrowRight, FlaskConical
} from 'lucide-react';
import { ScoreBar } from '@/components/ui/ScoreBar';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import type { EvaluationDetail, ChatMessage } from '@/types/hypothesis';

// ---------------------------------------------------------------------------
// Reference extraction utility (moved out of the mega-component)
// ---------------------------------------------------------------------------
function extractReferences(
  ...texts: string[]
): { title: string; url: string }[] {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const refs: { title: string; url: string }[] = [];
  const seenKeys = new Set<string>();
  const seenTitles = new Set<string>();

  texts.forEach(text => {
    if (!text) return;
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const title = match[1].trim();
      let url = match[2].trim();
      if (url.includes(' ') || !url.includes('.')) continue;
      if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
      const normalized = url.toLowerCase().trim().replace(/\/$/, '');
      const dedupeKey = normalized.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
      const titleKey = title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenKeys.has(dedupeKey) && !seenTitles.has(titleKey)) {
        seenKeys.add(dedupeKey);
        if (titleKey.length > 3) seenTitles.add(titleKey);
        refs.push({ title, url });
      }
    }
  });
  return refs;
}

// ---------------------------------------------------------------------------
// Tooltip wrapper
// ---------------------------------------------------------------------------
interface TooltipProps {
  text: string;
  children?: React.ReactNode;
}
function Tooltip({ text }: TooltipProps) {
  return (
    <div className="relative group inline-block">
      <Info className="w-3 h-3 text-foreground/30 hover:text-primary cursor-pointer" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2 bg-foreground text-background text-[9px] rounded-lg shadow-xl border border-foreground opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 normal-case font-normal leading-relaxed">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat parameter row
// ---------------------------------------------------------------------------
interface StatRowProps {
  label: string;
  value: string;
  tooltip: string;
  mono?: boolean;
}
function StatRow({ label, value, tooltip, mono = false }: StatRowProps) {
  return (
    <div className="flex justify-between items-center text-[10px] text-foreground/85">
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <Tooltip text={tooltip} />
      </div>
      <span
        className={`font-bold text-primary bg-primary/5 border border-primary/20 px-2 py-0.5 rounded text-[9px] max-w-[150px] truncate ${mono ? 'font-mono' : ''}`}
        title={value}
      >
        {value || 'N/A'}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
type SideTab = 'claims' | 'evidence';

interface TabBarProps {
  active: SideTab;
  onTabChange: (tab: SideTab) => void;
  onCollapse: () => void;
}
function TabBar({ active, onTabChange, onCollapse }: TabBarProps) {
  return (
    <div className="flex border-b border-border bg-border-muted shrink-0 items-center justify-between pr-2">
      <div className="flex flex-1">
        {(['claims', 'evidence'] as SideTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 py-3.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              active === tab
                ? 'border-primary text-primary bg-card'
                : 'border-transparent text-foreground/60 hover:text-foreground hover:bg-background/50'
            }`}
          >
            {tab === 'claims' ? 'Vulnerability' : 'Evidence & Sources'}
          </button>
        ))}
      </div>
      <button
        onClick={onCollapse}
        className="text-foreground/40 hover:text-primary p-1.5 rounded transition-colors cursor-pointer ml-2"
        title="Collapse Report"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Claims tab
// ---------------------------------------------------------------------------
interface ClaimsTabProps {
  result: EvaluationDetail;
}
function ClaimsTab({ result }: ClaimsTabProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Multidimensional Evaluation Profile Grid */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3.5">
        <div className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-border pb-2">
          Evaluation Profile
        </div>
        <div className="grid grid-cols-3 gap-2">
          <RadialGauge
            score={result.vulnerability_score ?? 5}
            max={10}
            label="Stress index"
            tooltipText="Overall stress test vulnerability score (higher means more weak spots)."
            colorClass="text-danger"
          />
          <RadialGauge
            score={result.empirical_evidence_score ?? 3}
            max={5}
            label="Evidence"
            tooltipText="Strength and volume of supporting literature."
            colorClass="text-success"
          />
          <RadialGauge
            score={result.logical_consistency_score ?? 3}
            max={5}
            label="Logical Rigor"
            tooltipText="Structural logic and consistency of assumptions."
            colorClass="text-primary"
          />
          <RadialGauge
            score={result.confounder_vulnerability_score ?? 3}
            max={5}
            label="Resiliency"
            tooltipText="Resistance to external confounders and variables."
            colorClass="text-warning"
          />
          <RadialGauge
            score={result.methodological_feasibility_score ?? 3}
            max={5}
            label="Feasibility"
            tooltipText="Practical feasibility of executing proposed experiments."
            colorClass="text-info"
          />
          <RadialGauge
            score={result.bias_vulnerability_score ?? 3}
            max={5}
            label="Bias Risk"
            tooltipText="Risk of cognitive, citation, or experimental bias."
            colorClass="text-secondary"
          />
        </div>
      </div>

      {/* Rigor & Design Parameters & Consensus Gauge */}
      <div className="grid grid-cols-1 gap-4">
        {/* Consensus Speedometer */}
        <ConsensusGauge index={result.scientific_consensus_index ?? 0.5} />

        {/* Design Stats */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
          <div className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-border pb-2">
            Rigor & Design Parameters
          </div>
          <div className="space-y-3">
            <StatRow label="Expected Effect Size"      value={result.expected_effect_size ?? 'N/A'}           tooltip="Effect Size indicates the magnitude of the scientific effect." />
            <StatRow label="Design Power & Sample Size" value={result.statistical_power_estimation ?? 'N/A'}  tooltip="Specifies the sample size (N) and statistical power (1-beta) required." />
            <StatRow label="Target Significance (α)"   value="α = 0.05"                                       tooltip="Alpha (α) is the threshold probability for false positive rate." mono />
            <StatRow label="False Discovery Target (FDR)" value="q ≤ 0.10"                                   tooltip="FDR targets the expected proportion of false positives." mono />
          </div>
        </div>
      </div>

      {/* Evaluation Summary */}
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="text-[10px] font-bold text-primary uppercase tracking-wider pb-1 border-b border-border/60 mb-2">
          Evaluation Summary
        </div>
        <p className="text-xs text-foreground/85 leading-relaxed font-light">{result.evaluation_summary}</p>
      </div>

      {/* Core Claim */}
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="text-[10px] font-bold text-primary uppercase tracking-wider pb-1 border-b border-border/60 mb-2">
          Core Claim
        </div>
        <div className="text-xs text-foreground/90 leading-relaxed font-medium">{result.core_claim}</div>
      </div>

      {/* Causal Pathway Flowchart */}
      <CausalFlowchart chain={result.causal_chain} />

      {/* Underlying Assumptions */}
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-3">
        <div className="text-[10px] font-bold text-primary uppercase tracking-wider pb-1 border-b border-border/60">
          Underlying Causal Assumptions
        </div>
        <div className="grid grid-cols-1 gap-2">
          {result.underlying_assumptions.map((ass, idx) => (
            <div key={idx} className="flex gap-2.5 items-start text-xs border border-border/60 bg-border-muted/10 rounded-xl p-3 shadow-2xs hover:shadow-xs transition-shadow">
              <span className="text-[9px] font-black text-primary bg-primary/5 border border-primary/20 px-1.5 py-0.5 rounded-md mt-0.5">
                {idx + 1}
              </span>
              <p className="leading-relaxed text-foreground/80 font-medium">{ass}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Proposed Verification Playbook Timeline */}
      <VerificationTimeline protocol={result.proposed_validation_protocol} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Visual Gauge & Flow Helpers
// ---------------------------------------------------------------------------
interface RadialGaugeProps {
  score: number;
  max: number;
  label: string;
  tooltipText: string;
  colorClass: string;
}

function RadialGauge({ score, max, label, tooltipText, colorClass }: RadialGaugeProps) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / max) * circumference;

  return (
    <div className="bg-card border border-border/80 rounded-xl p-2.5 flex flex-col items-center justify-between text-center relative group shadow-2xs hover:shadow-xs hover:border-primary/20 transition-all duration-300">
      <div className="relative w-11 h-11 flex items-center justify-center">
        <svg className="w-11 h-11 rotate-[-90deg]">
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-border-muted"
            strokeWidth="3"
            fill="transparent"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            className={`${colorClass} transition-all duration-500`}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-[10px] font-black font-mono text-foreground">{score}</span>
      </div>
      <div className="mt-1.5 flex items-center justify-center gap-0.5">
        <span className="text-[8px] font-bold text-foreground/75 tracking-tight uppercase leading-none truncate max-w-[55px]" title={label}>
          {label}
        </span>
        <Tooltip text={tooltipText} />
      </div>
    </div>
  );
}

function ConsensusGauge({ index }: { index: number }) {
  const pct = Math.round(index * 100);
  const radius = 25;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - index * circumference;

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
      <div className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-border pb-1 w-full text-center mb-3">
        Scientific Consensus Gauge
      </div>
      <div className="relative w-36 h-18 flex items-center justify-center">
        <svg className="w-36 h-18" viewBox="0 0 80 45">
          <path
            d="M 15,40 A 25,25 0 0,1 65,40"
            fill="none"
            stroke="var(--color-border-muted)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 15,40 A 25,25 0 0,1 65,40"
            fill="none"
            stroke="url(#consensus-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="consensus-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-secondary)" />
              <stop offset="100%" stopColor="var(--color-primary)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-xs font-black font-mono leading-none text-foreground">{pct}%</span>
          <span className="text-[7px] font-extrabold uppercase tracking-widest text-foreground/50 mt-0.5">
            {index >= 0.8 ? 'Consensus' : index >= 0.6 ? 'Emerging' : index >= 0.4 ? 'Divided' : 'Fringe'}
          </span>
        </div>
      </div>
      <div className="w-full flex justify-between text-[7px] text-foreground/45 font-bold uppercase tracking-wider px-2 mt-1">
        <span>Fringe</span>
        <span>Divided</span>
        <span>Emerging</span>
        <span>Consensus</span>
      </div>
    </div>
  );
}

function CausalFlowchart({ chain }: { chain: string[] }) {
  if (!chain || chain.length === 0) return null;

  return (
    <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-3">
      <div className="text-[10px] font-bold text-primary uppercase tracking-wider pb-1 border-b border-border/60">
        Causal Pathway Flowchart
      </div>
      <div className="flex flex-col items-center space-y-3 pt-1">
        {chain.map((step, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === chain.length - 1;
          const roleBadge = isFirst
            ? 'Trigger / Cause'
            : isLast
            ? 'Endpoint / Outcome'
            : 'Mediator Variable';
          const badgeColor = isFirst
            ? 'bg-success/10 text-success border-success/20'
            : isLast
            ? 'bg-primary/10 text-primary border-primary/20'
            : 'bg-info/10 text-info border-info/20';

          return (
            <React.Fragment key={idx}>
              {!isFirst && (
                <div className="flex flex-col items-center justify-center -my-1 h-6">
                  <svg className="w-4 h-6 text-primary/70 animate-pulse" viewBox="0 0 16 24">
                    <line
                      x1="8"
                      y1="0"
                      x2="8"
                      y2="16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                    <polygon points="8,22 4,14 12,14" fill="currentColor" />
                  </svg>
                </div>
              )}
              <div className="w-full group rounded-xl border border-border/70 bg-background/50 hover:bg-card p-3 shadow-2xs hover:shadow-xs transition-all duration-300 relative overflow-hidden">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] font-mono font-bold tracking-wider text-foreground/45 uppercase">
                    Step {idx + 1}
                  </span>
                  <span className={`text-[7px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {roleBadge}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-foreground/80 font-medium group-hover:text-foreground transition-colors">
                  {step}
                </p>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function parseTimelineSteps(markdown: string): { title: string; content: string; checked: boolean }[] {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const steps: { title: string; content: string; checked: boolean }[] = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    const match = trimmed.match(/^[-*\d.]+\s+(?:\*\*([^*]+)\*\*|([^:]+)):\s*(.*)$/);
    if (match) {
      const title = (match[1] || match[2]).trim();
      const content = match[3].trim();
      steps.push({ title, content, checked: false });
    } else {
      const generalMatch = trimmed.match(/^[-*\d.]+\s+(.*)$/);
      if (generalMatch) {
        const text = generalMatch[1].trim();
        const colonIndex = text.indexOf(':');
        if (colonIndex > 0) {
          const title = text.slice(0, colonIndex).replace(/\*\*/g, '').trim();
          const content = text.slice(colonIndex + 1).trim();
          steps.push({ title, content, checked: false });
        } else {
          steps.push({ title: 'Procedure', content: text, checked: false });
        }
      }
    }
  });

  return steps;
}

function VerificationTimeline({ protocol }: { protocol: string }) {
  const initialSteps = React.useMemo(() => parseTimelineSteps(protocol), [protocol]);
  const [steps, setSteps] = React.useState(initialSteps);

  React.useEffect(() => {
    setSteps(parseTimelineSteps(protocol));
  }, [protocol]);

  const toggleStep = (idx: number) => {
    setSteps(prev =>
      prev.map((step, i) => (i === idx ? { ...step, checked: !step.checked } : step))
    );
  };

  if (!steps || steps.length === 0) {
    return (
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider pb-1 border-b border-border/60 mb-2">
          <ListOrdered className="w-3.5 h-3.5" />
          Proposed Verification Protocol
        </div>
        <div className="text-xs leading-relaxed text-foreground/80">
          <MarkdownRenderer text={protocol} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-border/60">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
          <ListOrdered className="w-3.5 h-3.5" />
          Experimental Verification Playbook
        </div>
        <span className="text-[8px] font-bold uppercase tracking-wider text-primary/70 bg-primary/5 px-2 py-0.5 rounded-full">
          Interactive
        </span>
      </div>

      <div className="relative pl-5 space-y-5 pt-1">
        <div className="absolute top-2.5 bottom-2.5 left-2 w-0.5 bg-border" />
        {steps.map((step, idx) => {
          return (
            <div key={idx} className="relative flex items-start gap-3 text-xs group">
              <button
                onClick={() => toggleStep(idx)}
                className={`absolute -left-[20.5px] w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-all duration-300 z-10 cursor-pointer ${
                  step.checked
                    ? 'bg-success border-success text-white scale-110 shadow-xs'
                    : 'bg-card border-foreground/35 group-hover:border-primary group-hover:scale-105'
                }`}
              >
                {step.checked && (
                  <svg className="w-1.5 h-1.5 stroke-[4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <div className="flex-1 space-y-1">
                <h5
                  onClick={() => toggleStep(idx)}
                  className={`font-bold leading-tight cursor-pointer select-none transition-colors ${
                    step.checked ? 'text-foreground/45 line-through' : 'text-primary'
                  }`}
                >
                  {step.title}
                </h5>
                <p className={`leading-relaxed transition-colors ${
                  step.checked ? 'text-foreground/40' : 'text-foreground/80'
                }`}>
                  {step.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Evidence tab
// ---------------------------------------------------------------------------
interface EvidenceTabProps {
  result: EvaluationDetail;
  chatHistory: ChatMessage[];
}
function EvidenceTab({ result, chatHistory }: EvidenceTabProps) {
  const assistantMessages = chatHistory
    .filter(m => m.role === 'assistant')
    .map(m => m.content);
  const refs = extractReferences(result.supporting_evidence, result.counter_evidence, result.companies_and_labs || '', ...assistantMessages);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Supporting Evidence */}
      <div className="space-y-2.5 bg-card border border-border border-l-4 border-l-success p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-success uppercase tracking-wider pb-1.5 border-b border-border">
          <CheckCircle className="w-3.5 h-3.5 text-success animate-pulse" />
          Supporting Evidence
        </div>
        <MarkdownRenderer text={result.supporting_evidence} />
      </div>

      {/* Counter Evidence */}
      <div className="space-y-2.5 bg-card border border-border border-l-4 border-l-danger p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-danger uppercase tracking-wider pb-1.5 border-b border-border">
          <AlertTriangle className="w-3.5 h-3.5 text-danger" />
          Counterarguments & Gaps
        </div>
        <MarkdownRenderer text={result.counter_evidence} />
      </div>

      {/* Active Labs, Companies & Recent Findings */}
      {result.companies_and_labs && (
        <div className="space-y-2.5 bg-card border border-border border-l-4 border-l-primary p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider pb-1.5 border-b border-border">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            Active Labs, Companies & Recent Findings
          </div>
          <MarkdownRenderer text={result.companies_and_labs} />
        </div>
      )}

      {/* Academic References */}
      <div className="space-y-4 bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider pb-1.5 border-b border-border mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          Academic References & Sources
        </div>
        {refs.length === 0 ? (
          <p className="text-[11px] text-foreground/50 italic">
            No academic citations yet. Ask the assistant to look up papers!
          </p>
        ) : (
          <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
            {refs.map((ref, idx) => (
              <div key={idx} className="flex gap-2.5 items-start text-xs border-b border-background pb-2.5 last:border-b-0 last:pb-0 group">
                <span className="text-primary font-mono font-bold">[{idx + 1}]</span>
                <div className="flex-1 space-y-0.5">
                  <h5 className="font-semibold text-foreground/85 leading-snug group-hover:text-primary transition-colors">{ref.title}</h5>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover hover:underline text-[10px] break-all inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    {ref.url}<span className="text-[9px]">↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
interface ReportPanelProps {
  result: EvaluationDetail;
  chatHistory: ChatMessage[];
  isCollapsed: boolean;
  onCollapse: () => void;
  onExpand: () => void;
}

/**
 * Left report panel with Vulnerability / Evidence tabs and collapsible behaviour.
 */
export function ReportPanel({
  result,
  chatHistory,
  isCollapsed,
  onCollapse,
  onExpand,
}: ReportPanelProps) {
  const [activeTab, setActiveTab] = React.useState<SideTab>('claims');

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center py-4 space-y-4 h-full border-r border-border bg-card md:w-12 shrink-0">
        <button
          onClick={onExpand}
          className="p-1.5 hover:bg-background rounded-lg text-primary transition-colors cursor-pointer"
          title="Expand Report"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center gap-1.5 text-[9px] font-bold text-foreground/40 uppercase tracking-widest select-none pt-4 [writing-mode:vertical-lr] rotate-180">
          <Beaker className="w-3.5 h-3.5 text-primary mb-2 -rotate-90" />
          Evaluation Report
        </div>
      </div>
    );
  }

  return (
    <main className="border-r border-border bg-card flex flex-col overflow-hidden h-full w-full md:w-[460px] shrink-0 transition-all duration-300">
      <TabBar active={activeTab} onTabChange={setActiveTab} onCollapse={onCollapse} />
      <div className="flex-1 overflow-y-auto p-4 bg-border-muted/40 space-y-4">
        {activeTab === 'claims' && <ClaimsTab result={result} />}
        {activeTab === 'evidence' && <EvidenceTab result={result} chatHistory={chatHistory} />}
      </div>
    </main>
  );
}
