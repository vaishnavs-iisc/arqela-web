import React from 'react';
import {
  CheckCircle, AlertTriangle, BookOpen, ChevronRight,
  ListOrdered, Beaker, ChevronLeft, Info,
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
  const biasScore = result.bias_vulnerability_score || 3;
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Scientific Scores */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
        <div className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-border pb-2">
          Scientific Scores
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ScoreBar label="Evidence Strength" score={result.empirical_evidence_score || 3} />
          <ScoreBar label="Consistency"       score={result.logical_consistency_score || 3} />
          <ScoreBar label="Resiliency"        score={result.confounder_vulnerability_score || 3} />
          <ScoreBar label="Feasibility"       score={result.methodological_feasibility_score || 3} />
        </div>
      </div>

      {/* Rigor & Design Parameters */}
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

        <hr className="border-border/60" />

        {/* Scientific Consensus */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] text-foreground/85">
            <div className="flex items-center gap-1">
              <span>Consensus Index</span>
              <Tooltip text="Score from 0.0 (no consensus) to 1.0 (universal agreement)." />
            </div>
            <span className="font-bold text-primary">
              {Math.round((result.scientific_consensus_index ?? 0.5) * 100)}%
            </span>
          </div>
          <div className="relative h-1.5 bg-background rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500"
              style={{ width: `${(result.scientific_consensus_index ?? 0.5) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[7px] text-foreground/40 font-semibold uppercase">
            <span>Fringe</span><span>Divided</span><span>Emerging</span><span>Consensus</span>
          </div>
        </div>

        {/* Bias Risk */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-foreground/85">
            <div className="flex items-center gap-1">
              <span>Bias Vulnerability Risk</span>
              <Tooltip text="Assesses likelihood of common scientific biases." />
            </div>
            <span className="font-bold text-primary">{biasScore} / 5</span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 3, 4, 5].map(block => {
              const colorClass = block <= biasScore
                ? biasScore >= 4 ? 'bg-danger' : biasScore === 3 ? 'bg-warning' : 'bg-success'
                : 'bg-background';
              return <div key={block} className={`h-1.5 rounded-full transition-all ${colorClass}`} />;
            })}
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

      {/* Causal Chain */}
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="text-[10px] font-bold text-primary uppercase tracking-wider pb-1 border-b border-border/60 mb-2">
          Causal Sequence Timeline
        </div>
        <div className="relative pl-5 space-y-4 pt-1">
          <div className="absolute top-2 bottom-2 left-2 w-0.5 bg-border" />
          {result.causal_chain.map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-2.5 text-xs">
              <div className="absolute -left-[18.5px] w-2.5 h-2.5 rounded-full bg-primary border-2 border-white shadow-sm z-10" />
              <p className="text-foreground/85 leading-relaxed">
                <strong className="text-primary">Step {idx + 1}:</strong> {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Underlying Assumptions */}
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="text-[10px] font-bold text-primary uppercase tracking-wider pb-1 border-b border-border/60 mb-2">
          Underlying Assumptions
        </div>
        <ul className="space-y-1.5 pl-1">
          {result.underlying_assumptions.map((ass, idx) => (
            <li key={idx} className="flex items-start gap-1 text-xs text-foreground/85">
              <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span className="leading-relaxed">{ass}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Validation Protocol */}
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider pb-1 border-b border-border/60 mb-2">
          <ListOrdered className="w-3.5 h-3.5" />
          Proposed Verification Protocol
        </div>
        <div className="text-xs leading-relaxed text-foreground/90 pt-1">
          <MarkdownRenderer text={result.proposed_validation_protocol} />
        </div>
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
  const refs = extractReferences(result.supporting_evidence, result.counter_evidence, ...assistantMessages);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Supporting Evidence */}
      <div className="space-y-2.5 bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-success uppercase tracking-wider pb-1.5 border-b border-border">
          <CheckCircle className="w-3.5 h-3.5 text-success" />
          Supporting Evidence
        </div>
        <MarkdownRenderer text={result.supporting_evidence} />
      </div>

      {/* Counter Evidence */}
      <div className="space-y-2.5 bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-danger uppercase tracking-wider pb-1.5 border-b border-border">
          <AlertTriangle className="w-3.5 h-3.5 text-danger" />
          Counterarguments & Gaps
        </div>
        <MarkdownRenderer text={result.counter_evidence} />
      </div>

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
              <div key={idx} className="flex gap-2.5 items-start text-xs border-b border-background pb-2.5 last:border-b-0 last:pb-0">
                <span className="text-primary font-mono font-bold">[{idx + 1}]</span>
                <div className="flex-1 space-y-0.5">
                  <h5 className="font-semibold text-foreground/85 leading-snug">{ref.title}</h5>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover hover:underline text-[10px] break-all inline-flex items-center gap-0.5"
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
