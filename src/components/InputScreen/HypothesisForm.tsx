import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

const DOMAINS = [
  'Physics', 'Astrophysics', 'Chemistry', 'Biology', 'Neuroscience',
  'Medicine', 'Software Engineering', 'Economics', 'Psychology',
  'Strategy & Innovation',
];

const EXAMPLES = [
  { domain: 'Neuroscience', text: 'Targeted REM sleep stimulation accelerates memory consolidation in early stage neurodegeneration.' },
  { domain: 'Economics', text: 'Universal Basic Income increases entrepreneurial risk taking without reducing net labor participation.' },
  { domain: 'Physics', text: 'Room temperature superconductivity can be stabilized using hydrides under ambient pressure gradients.' }
];

interface HypothesisFormProps {
  hypothesis: string;
  domain: string;
  isLoading: boolean;
  onHypothesisChange: (value: string) => void;
  onDomainChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function HypothesisForm({
  hypothesis,
  domain,
  isLoading,
  onHypothesisChange,
  onDomainChange,
  onSubmit,
}: HypothesisFormProps) {
  return (
    <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="space-y-1">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Research Audit Engine
        </h2>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Stress Test a Scientific Claim
        </h3>
        <p className="text-xs sm:text-sm text-foreground/70">
          Select an academic domain and enter your core hypothesis statement to generate a comprehensive peer review audit.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Domain selector */}
        <div>
          <label className="block text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2">
            Academic Domain
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DOMAINS.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => onDomainChange(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  domain === d
                    ? 'bg-primary border-primary text-white shadow-sm'
                    : 'bg-border-muted border-border text-foreground/70 hover:border-primary/50 hover:bg-background'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Hypothesis textarea */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-foreground/80 uppercase tracking-wider">
              Hypothesis Statement
            </label>
          </div>
          <textarea
            id="hypothesis-input"
            rows={4}
            value={hypothesis}
            onChange={e => onHypothesisChange(e.target.value)}
            placeholder="Formulate your core scientific statement, mechanism, or claim..."
            className="w-full bg-background border border-border rounded-xl p-3.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-foreground/40 resize-none leading-relaxed transition-all shadow-inner"
          />
        </div>

        {/* Quick Example Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-foreground/60 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-primary" /> Example Research Questions:
          </span>
          <div className="flex flex-col gap-1.5">
            {EXAMPLES.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onDomainChange(ex.domain);
                  onHypothesisChange(ex.text);
                }}
                className="text-left text-xs p-2 rounded-lg bg-border-muted/50 hover:bg-border-muted text-foreground/80 transition-colors border border-transparent hover:border-border cursor-pointer truncate"
              >
                <span className="font-semibold text-primary mr-1.5">[{ex.domain}]</span>
                {ex.text}
              </button>
            ))}
          </div>
        </div>

        <button
          id="analyze-button"
          type="submit"
          disabled={isLoading || !hypothesis.trim()}
          className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover disabled:bg-border-muted disabled:text-foreground/40 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isLoading ? 'Running Peer Review Audit...' : 'Audit Hypothesis with Arqela'}
        </button>
      </form>
    </div>
  );
}
