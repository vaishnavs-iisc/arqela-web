'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { sendChatMessage } from '@/lib/api';
import type { ChatMessage } from '@/types/hypothesis';

interface UseChatReturn {
  chatHistory: ChatMessage[];
  chatInput: string;
  isChatLoading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (e: React.FormEvent, conversationId: string | null) => Promise<void>;
}

/**
 * Manages chat state and the SSE streaming conversation with the backend.
 */
export function useChat(): UseChatReturn {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom whenever history changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent, conversationId: string | null) => {
      e.preventDefault();
      const userMsg = chatInput.trim();
      if (!userMsg || isChatLoading) return;

      if (!conversationId) {
        alert('Active hypothesis evaluation ID is loading. Please try sending again in a moment.');
        return;
      }

      setChatInput('');
      setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
      setIsChatLoading(true);

      try {
        const response = await sendChatMessage(conversationId, userMsg);

        if (!response.ok || !response.body) {
          setChatHistory(prev => [
            ...prev,
            { role: 'assistant', content: 'Connection issue. Please try again.' },
          ]);
          return;
        }

        // Append an empty assistant bubble that we'll fill token-by-token
        setChatHistory(prev => [...prev, { role: 'assistant', content: '' }]);
        setIsChatLoading(false);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantReply = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunkText = decoder.decode(value, { stream: true });
          for (const line of chunkText.split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if (!raw) continue;
            try {
              const data = JSON.parse(raw);
              if (data.text) {
                assistantReply += data.text;
                setChatHistory(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: assistantReply,
                  };
                  return updated;
                });
              }
            } catch {
              // malformed chunk — skip
            }
          }
        }
      } catch (err) {
        console.error('Chat stream error:', err);
        setChatHistory(prev => [
          ...prev,
          { role: 'assistant', content: 'The connection timed out. Please try again.' },
        ]);
      } finally {
        setIsChatLoading(false);
      }
    },
    [chatInput, isChatLoading]
  );

  return {
    chatHistory,
    chatInput,
    isChatLoading,
    chatEndRef,
    setChatHistory,
    setChatInput,
    handleSendMessage,
  };
}
