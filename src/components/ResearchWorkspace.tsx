'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, MessageSquare, X } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { HistorySidebar } from '@/components/HistorySidebar';
import { HypothesisForm } from '@/components/InputScreen/HypothesisForm';
import { LoadingScreen } from '@/components/Workspace/LoadingScreen';
import { ReportPanel } from '@/components/Workspace/ReportPanel';
import { ChatPanel } from '@/components/Workspace/ChatPanel';
import { useHypothesisEval } from '@/hooks/useHypothesisEval';
import { useHistory } from '@/hooks/useHistory';
import { useChat } from '@/hooks/useChat';
import type { EvaluationDetail } from '@/types/hypothesis';

type Screen = 'input' | 'workspace';
type MobileTab = 'report' | 'chat';
const DEFAULT_DOMAIN = 'Biology';

export function ResearchWorkspace() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const conversationId = params?.id;

  const [screen, setScreen] = useState<Screen>('input');
  const [mobileTab, setMobileTab] = useState<MobileTab>('report');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const [hypothesisInput, setHypothesisInput] = useState('');
  const [domainInput, setDomainInput] = useState(DEFAULT_DOMAIN);
  const [result, setResult] = useState<EvaluationDetail | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [isReportCollapsed, setIsReportCollapsed] = useState(false);

  const { isLoading, loadingLog, loadingProgress, handleEvaluate } = useHypothesisEval();
  const { history, loadHistory, loadDetail } = useHistory();
  const { chatHistory, chatInput, isChatLoading, chatEndRef, setChatHistory, setChatInput, handleSendMessage } = useChat();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (!conversationId) return;
    // Bypass fetching from DB if we already have this conversation result in memory
    if (result && result.conversation_id === conversationId) return;

    loadDetail(conversationId).then(detail => {
      if (!detail) {
        router.replace('/');
        return;
      }
      setResult(detail);
      setActiveId(conversationId);
      setHypothesisInput(detail.raw_hypothesis);
      setDomainInput(detail.academic_domain);
      setChatHistory(detail.conversation_history ?? []);
      setScreen('workspace');
    });
  }, [conversationId, loadDetail, router, setChatHistory, result]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hypothesisInput.trim()) return;
    setResult(null);
    setChatHistory([]);
    setScreen('workspace');

    let latestDetail: EvaluationDetail | null = null;

    await handleEvaluate(
      hypothesisInput,
      domainInput,
      detail => {
        latestDetail = detail;
        setResult(detail);
        if (detail.conversation_history?.length) {
          setChatHistory(detail.conversation_history);
        }
      },
      () => setScreen('input')
    );

    // Redirect to the conversation URL ONLY after the stream completes and it is saved in PostgreSQL
    if (latestDetail && latestDetail.conversation_id) {
      setActiveId(latestDetail.conversation_id);
      loadHistory();
      router.push(`/conversations/${latestDetail.conversation_id}`);
    }
  };

  const handleSelectHistory = async (id: string) => {
    setIsMobileDrawerOpen(false);
    setActiveId(id);
    const detail = await loadDetail(id);
    if (!detail) return;
    setResult(detail);
    setHypothesisInput(detail.raw_hypothesis);
    setDomainInput(detail.academic_domain);
    setChatHistory(detail.conversation_history ?? []);
    setScreen('workspace');
    router.push(`/conversations/${id}`);
  };

  const handleReset = () => {
    setIsMobileDrawerOpen(false);
    setResult(null);
    setHypothesisInput('');
    setChatHistory([]);
    setScreen('input');
    setActiveId(null);
    router.push('/');
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-foreground">
      <AppHeader
        onLogoClick={handleReset}
        onToggleMobileSidebar={() => setIsMobileDrawerOpen(v => !v)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop History Sidebar */}
        <div className={`${screen === 'input' ? 'hidden md:flex' : 'hidden md:flex'} h-full`}>
          <HistorySidebar
            history={history}
            activeId={activeId}
            isCollapsed={isHistoryCollapsed}
            onToggleCollapse={() => setIsHistoryCollapsed(v => !v)}
            onSelectRecord={handleSelectHistory}
          />
        </div>

        {/* Mobile History Drawer Overlay */}
        {isMobileDrawerOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-foreground/40 backdrop-blur-xs"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
            <div className="relative w-4/5 max-w-xs bg-card h-full z-10 shadow-2xl flex flex-col">
              <div className="p-4 border-b border-border flex justify-between items-center bg-card">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">History</span>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded text-foreground/60 hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <HistorySidebar
                  history={history}
                  activeId={activeId}
                  isCollapsed={false}
                  onToggleCollapse={() => setIsMobileDrawerOpen(false)}
                  onSelectRecord={handleSelectHistory}
                />
              </div>
            </div>
          </div>
        )}

        {/* Input Screen */}
        {screen === 'input' && (
          <div className="flex-1 flex flex-col overflow-y-auto items-center justify-center p-6 md:p-12">
            <HypothesisForm
              hypothesis={hypothesisInput}
              domain={domainInput}
              isLoading={isLoading}
              onHypothesisChange={setHypothesisInput}
              onDomainChange={setDomainInput}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        {/* Workspace Screen */}
        {screen === 'workspace' && (
          <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
            {isLoading && !result?.core_claim ? (
              <LoadingScreen progress={loadingProgress} message={loadingLog} />
            ) : (
              result && (
                <>
                  {/* Streaming Agent Status Banner */}
                  {isLoading && (
                    <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-between gap-4 shrink-0 animate-pulse text-[11px] font-semibold text-primary">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span>{loadingLog}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-primary/15 border border-primary/25 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full transition-all duration-300"
                            style={{ width: `${loadingProgress}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] tabular-nums">{loadingProgress}%</span>
                      </div>
                    </div>
                  )}

                  {/* Mobile Tab Navigation (<768px) */}
                  <div className="md:hidden flex border-b border-border bg-card shrink-0">
                    <button
                      onClick={() => setMobileTab('report')}
                      className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
                        mobileTab === 'report'
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-transparent text-foreground/60'
                      }`}
                    >
                      <FileText className="w-4 h-4" /> Report
                    </button>
                    <button
                      onClick={() => setMobileTab('chat')}
                      className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
                        mobileTab === 'chat'
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-transparent text-foreground/60'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" /> AI Copilot
                    </button>
                  </div>

                  {/* Main Workspace Layout */}
                  <div className="flex-1 flex overflow-hidden w-full h-full">
                    {/* Desktop Split View / Mobile Tab View */}
                    <div
                      className={`h-full w-full md:w-auto ${
                        mobileTab === 'report' ? 'flex' : 'hidden md:flex'
                      }`}
                    >
                      <ReportPanel
                        result={result}
                        chatHistory={chatHistory}
                        isCollapsed={isReportCollapsed}
                        onCollapse={() => setIsReportCollapsed(true)}
                        onExpand={() => setIsReportCollapsed(false)}
                      />
                    </div>

                    <div
                      className={`h-full flex-1 ${
                        mobileTab === 'chat' ? 'flex' : 'hidden md:flex'
                      }`}
                    >
                      <ChatPanel
                        chatHistory={chatHistory}
                        chatInput={chatInput}
                        isChatLoading={isChatLoading}
                        chatEndRef={chatEndRef}
                        onInputChange={setChatInput}
                        onSubmit={e => handleSendMessage(e, activeId || result?.conversation_id || null)}
                      />
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
