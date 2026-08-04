/**
 * All TypeScript interfaces for the Hypothesis Testing domain.
 * Extracted from page.tsx — import from here everywhere else.
 */

export interface EvaluationRecord {
  conversation_id?: string;
  hypothesis: string;
  domain: string;
  vulnerability_score?: number;
  empirical_evidence_score?: number;
  logical_consistency_score?: number;
  confounder_vulnerability_score?: number;
  methodological_feasibility_score?: number;
  evaluation_summary?: string;
}

export interface EvaluationDetail {
  conversation_id?: string;
  raw_hypothesis: string;
  academic_domain: string;
  core_claim: string;
  underlying_assumptions: string[];
  causal_chain: string[];
  supporting_evidence: string;
  counter_evidence: string;
  vulnerability_score: number;
  empirical_evidence_score: number;
  logical_consistency_score: number;
  confounder_vulnerability_score: number;
  methodological_feasibility_score: number;
  evaluation_summary: string;
  critical_weaknesses: string[];
  proposed_validation_protocol: string;
  agent_logs: string[];
  is_cache_hit?: boolean;
  expected_effect_size?: string;
  statistical_power_estimation?: string;
  scientific_consensus_index?: number;
  bias_vulnerability_score?: number;
  conversation_history?: ChatMessage[];
  companies_and_labs?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SSEProgressEvent {
  type: 'progress';
  node: string;
  percentage: number;
  message: string;
}

export interface SSEResultEvent {
  type: 'result';
  data: EvaluationDetail;
}

export interface SSEErrorEvent {
  type: 'error';
  message: string;
}

export type SSEEvent = SSEProgressEvent | SSEResultEvent | SSEErrorEvent;
