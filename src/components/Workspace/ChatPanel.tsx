import React from 'react';
import { MessageSquare, RefreshCw, Send } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import type { ChatMessage } from '@/types/hypothesis';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  chatInput: string;
  isChatLoading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Right-hand streaming chat assistant panel.
 */
export function ChatPanel({
  chatHistory,
  chatInput,
  isChatLoading,
  chatEndRef,
  onInputChange,
  onSubmit,
}: ChatPanelProps) {
  return (
    <aside className="bg-border-muted border-l border-border flex flex-col overflow-hidden h-full flex-1">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card shrink-0">
        <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-primary" />
          Chat Assistant
        </span>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-card/40">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${msg.role === 'user' ? 'user-message' : ''} ${
                msg.role === 'user'
                  ? 'bg-primary text-white font-medium'
                  : 'bg-card text-foreground border border-border'
              }`}
            >
              <MarkdownRenderer text={msg.content} />
            </div>
          </div>
        ))}

        {isChatLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground/60 flex items-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Formulating analysis…
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={onSubmit} className="p-4 border-t border-border bg-card flex gap-2 shrink-0">
        <input
          id="chat-input"
          type="text"
          value={chatInput}
          onChange={e => onInputChange(e.target.value)}
          placeholder="Ask a question about the evidence or design…"
          disabled={isChatLoading}
          className="flex-1 bg-border-muted border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all"
        />
        <button
          id="chat-send-button"
          type="submit"
          disabled={isChatLoading || !chatInput.trim()}
          className="bg-primary text-white hover:bg-primary-hover p-2.5 rounded-lg disabled:bg-border-muted disabled:text-foreground/40 transition-colors shrink-0 shadow-sm cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
}
