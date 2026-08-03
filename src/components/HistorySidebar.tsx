import React from 'react';
import { History, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { EvaluationRecord } from '@/types/hypothesis';

interface HistorySidebarProps {
  history: EvaluationRecord[];
  activeId: string | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectRecord: (id: string) => void;
  onNewAudit: () => void;
}

/**
 * Collapsible sidebar that shows the history of hypothesis evaluations.
 * Visible on the input screen; hidden on mobile workspace.
 */
export function HistorySidebar({
  history,
  activeId,
  isCollapsed,
  onToggleCollapse,
  onSelectRecord,
  onNewAudit,
}: HistorySidebarProps) {
  return (
    <aside
      className={`border-b md:border-b-0 md:border-r border-border bg-card/60 flex flex-col shrink-0 md:h-full transition-all duration-300 ${
        isCollapsed ? 'w-full md:w-12' : 'w-full md:w-64'
      }`}
    >
      {isCollapsed ? (
        /* Collapsed strip */
        <div className="flex flex-col items-center py-4 space-y-4 h-full">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 hover:bg-background rounded-lg text-primary transition-colors cursor-pointer"
            title="Expand Conversations"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onNewAudit}
            className="p-1.5 hover:bg-primary/10 rounded-lg text-primary transition-all cursor-pointer border border-primary/20 bg-primary/5"
            title="New Conversation"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center gap-1.5 text-[9px] font-bold text-foreground/40 uppercase tracking-widest select-none pt-4 [writing-mode:vertical-lr] rotate-180">
            <History className="w-3.5 h-3.5 text-primary mb-2 -rotate-90" />
            Conversations
          </div>
        </div>
      ) : (
        /* Expanded panel */
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-4 border-b border-border flex items-center justify-between bg-card/40 shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground/80 uppercase tracking-wider">
              <History className="w-4 h-4 text-primary" />
              Conversations
            </div>
            <button
              onClick={onToggleCollapse}
              className="text-foreground/40 hover:text-primary p-1.5 rounded transition-colors cursor-pointer"
              title="Collapse Conversations"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* New Conversation Button */}
          <div className="px-3 pt-3 pb-1 shrink-0">
            <button
              onClick={onNewAudit}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-primary/25 bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[220px] md:max-h-none">
            {history.length === 0 ? (
              <p className="text-xs text-foreground/50 text-center py-6">No past conversations.</p>
            ) : (
              history.map(record => (
                <button
                  key={record.conversation_id}
                  onClick={() => record.conversation_id != null && onSelectRecord(record.conversation_id)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                    activeId === record.conversation_id
                      ? 'bg-primary/10 border-primary/30 font-medium shadow-sm'
                      : 'border-transparent hover:border-primary/30 hover:bg-border-muted text-foreground/80'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <Badge variant="primary">{record.domain}</Badge>
                    {record.vulnerability_score != null && (
                      <Badge variant="muted">Vuln: {record.vulnerability_score}/5</Badge>
                    )}
                  </div>
                  <p className="line-clamp-2 leading-relaxed text-foreground/90">{record.hypothesis}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
