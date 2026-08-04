import React from 'react';

/**
 * Renders a subset of Markdown as React elements:
 *   - Bullet lists (- / *)
 *   - Numbered lists (1. 2. …)
 *   - Bold (**text**)
 *   - Hyperlinks ([title](url))
 *   - Strips heading markers (# / ## / ###)
 *
 * Extracted from page.tsx — used by ReportPanel and ChatPanel.
 */

function parseInline(text: string): React.ReactNode[] {
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('[') && part.includes('](')) {
      const closeBracket = part.indexOf(']');
      const title = part.slice(1, closeBracket);
      let url = part.slice(closeBracket + 2).trim();

      if (url.endsWith(')')) {
        url = url.slice(0, -1);
      }
      url = url.trim();

      // Filter non-URLs
      if (url.includes(' ') || !url.includes('.')) return part;
      if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

      return (
        <a
          key={idx}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-hover hover:underline font-semibold inline-flex items-center gap-0.5 decoration-primary/50 cursor-pointer"
        >
          {title}
          <span className="text-[10px]">↗</span>
        </a>
      );
    }
    return part;
  });
}

interface MarkdownRendererProps {
  text: string;
}

export function MarkdownRenderer({ text }: MarkdownRendererProps) {
  if (!text) return null;

  const cleanText = text
    .replace(/^###\s+/gm, '')
    .replace(/^##\s+/gm, '')
    .replace(/^#\s+/gm, '');

  return (
    <div className="space-y-2 text-xs text-foreground/85 leading-relaxed">
      {cleanText.split('\n').map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5">
              <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
              <div className="flex-1">{parseInline(trimmed.replace(/^[-*]\s+/, ''))}</div>
            </div>
          );
        }

        if (/^\d+\.\s+/.test(trimmed)) {
          const num = trimmed.match(/^\d+/)?.[0] ?? '1';
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5">
              <span className="text-primary font-mono text-xs font-bold shrink-0">{num}.</span>
              <div className="flex-1">{parseInline(trimmed.replace(/^\d+\.\s+/, ''))}</div>
            </div>
          );
        }

        return <p key={idx}>{parseInline(trimmed)}</p>;
      })}
    </div>
  );
}
