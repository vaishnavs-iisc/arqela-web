'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FileText, MessageSquare, X, RefreshCw } from 'lucide-react';
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

function LiveAgentProgress({ progress, message, logs }: { progress: number; message: string; logs: string[] }) {
  const steps = [
    { name: 'Theory Analyst', desc: 'Deconstructing core claims & causal assumptions', activePct: [0, 25] },
    { name: 'Proponent Agent', desc: 'Searching academic literature for supporting evidence', activePct: [26, 50] },
    { name: 'Skeptic Auditor', desc: 'Auditing counter-arguments, biases & confounders', activePct: [51, 75] },
    { name: 'Scientific Arbiter', desc: 'Synthesising consensus & drafting validation protocol', activePct: [76, 100] },
  ];

  return (
    <div className="h-full flex-1 flex flex-col bg-card border-l border-border overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-border bg-border-muted/50 shrink-0">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Multi-Agent Audit Status
        </h3>
      </div>

      {/* Progress Dashboard */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Large Progress Circle or Bar */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-extrabold text-primary font-mono tracking-tighter">
            {progress}%
          </div>
          <div className="text-[11px] font-semibold text-foreground/80 max-w-xs mx-auto animate-pulse">
            {message}
          </div>
          <div className="w-full max-w-sm mx-auto bg-primary/10 border border-primary/10 h-2.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-primary h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps Checklist */}
        <div className="space-y-3 bg-background/40 border border-border p-4 rounded-xl shadow-sm">
          {steps.map((step, idx) => {
            const isCompleted = progress > step.activePct[1];
            const isActive = progress >= step.activePct[0] && progress <= step.activePct[1];
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 p-2 rounded-lg transition-all duration-300 border ${
                  isActive
                    ? 'bg-primary/5 border-primary/20 shadow-xs'
                    : 'opacity-65 border-transparent'
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-primary text-background text-[9px] font-bold">✓</span>
                  ) : isActive ? (
                    <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full border-2 border-primary border-t-transparent animate-spin text-[8px]" />
                  ) : (
                    <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full border border-border text-[9px] font-mono text-foreground/50">{idx + 1}</span>
                  )}
                </div>
                <div>
                  <div className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-foreground/90'}`}>
                    {step.name}
                  </div>
                  <div className="text-[10px] text-foreground/60 leading-relaxed mt-0.5">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Logs Console */}
        {logs && logs.length > 0 && (
          <div className="h-[120px] max-h-[120px] border border-border bg-black/5 rounded-xl p-3.5 font-mono text-[9px] leading-normal text-foreground/75 overflow-y-auto flex flex-col-reverse shadow-inner select-none">
            <div className="space-y-1">
              {logs.slice().reverse().map((log, idx) => (
                <div key={idx} className="flex gap-1.5 items-start">
                  <span className="text-primary select-none">&gt;</span>
                  <span className="truncate">{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export function ResearchWorkspace() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const conversationId = params?.id;
  const searchParams = useSearchParams();

  const isNew = searchParams?.get('new') === 'true';
  const queryHypothesis = searchParams?.get('q') || '';
  const queryDomain = searchParams?.get('domain') || '';

  const [screen, setScreen] = useState<Screen>(conversationId ? 'workspace' : 'input');
  const [mobileTab, setMobileTab] = useState<MobileTab>('report');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const [hypothesisInput, setHypothesisInput] = useState('');
  const [domainInput, setDomainInput] = useState(DEFAULT_DOMAIN);
  const [result, setResult] = useState<EvaluationDetail | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [isReportCollapsed, setIsReportCollapsed] = useState(false);

  const { isLoading, loadingLog, loadingProgress, handleEvaluate } = useHypothesisEval();
  const { history, isDetailLoading, loadHistory, loadDetail } = useHistory();
  const { chatHistory, chatInput, isChatLoading, chatEndRef, setChatHistory, setChatInput, handleSendMessage, sendDirectMessage } = useChat();

  const evaluationTriggeredRef = useRef<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (!conversationId) return;

    // Handle a new workflow redirect route
    if (isNew && queryHypothesis) {
      if (evaluationTriggeredRef.current === conversationId) return;
      evaluationTriggeredRef.current = conversationId;

      setScreen('workspace');
      setResult(null);
      setChatHistory([]);
      setHypothesisInput(queryHypothesis);
      setDomainInput(queryDomain || DEFAULT_DOMAIN);
      setActiveId(conversationId);

      // Clean the query parameters from the URL immediately so user gets clean view
      const cleanUrl = `/conversations/${conversationId}`;
      window.history.replaceState({ ...window.history.state, as: cleanUrl, url: cleanUrl }, '', cleanUrl);

      handleEvaluate(
        queryHypothesis,
        queryDomain || DEFAULT_DOMAIN,
        detail => {
          setResult(detail);
          if (detail.conversation_history?.length) {
            setChatHistory(detail.conversation_history);
          }
          loadHistory();
        },
        () => setScreen('input'),
        conversationId
      );
      return;
    }

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
  }, [conversationId, isNew, queryHypothesis, queryDomain, loadDetail, router, setChatHistory, result, handleEvaluate, loadHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hypothesisInput.trim()) return;

    const newId = crypto.randomUUID();
    router.push(
      `/conversations/${newId}?new=true&q=${encodeURIComponent(hypothesisInput)}&domain=${encodeURIComponent(domainInput)}`
    );
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
    
    // Update browser URL instantly without Next.js page remount
    window.history.pushState(
      { ...window.history.state, as: `/conversations/${id}`, url: `/conversations/${id}` },
      '',
      `/conversations/${id}`
    );
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
            onNewAudit={handleReset}
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
                  onNewAudit={handleReset}
                />
              </div>
            </div>
          </div>
        )}

        {/* Input Screen */}
        {screen === 'input' && (
          <div className="flex-1 flex flex-col overflow-y-auto items-center justify-start p-6 md:p-12">
            <div className="my-auto w-full flex justify-center">
              <HypothesisForm
                hypothesis={hypothesisInput}
                domain={domainInput}
                isLoading={isLoading}
                onHypothesisChange={setHypothesisInput}
                onDomainChange={setDomainInput}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        )}

        {/* Workspace Screen */}
        {screen === 'workspace' && (
          <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
            {(!result && isDetailLoading) ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-card text-foreground">
                <RefreshCw className="w-8 h-8 animate-spin text-primary mb-3" />
                <span className="text-sm font-semibold text-foreground/60 animate-pulse">Loading Evaluation...</span>
              </div>
            ) : isLoading && !result?.core_claim ? (
              <LoadingScreen progress={loadingProgress} message={loadingLog} />
            ) : (
              result && (
                <>
                  {/* Streaming Agent Status Banner */}
                  {isLoading && (
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20 px-4 py-2.5 flex items-center justify-between gap-4 shrink-0 text-xs font-semibold text-primary shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="tracking-wide">Arqela Multi-Agent Audit: {loadingLog}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-primary/20 border border-primary/30 h-2 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="bg-primary h-full transition-all duration-300 rounded-full"
                            style={{ width: `${loadingProgress}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold tabular-nums">{loadingProgress}%</span>
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
                      <MessageSquare className="w-4 h-4" /> {isLoading ? 'Audit Status' : 'AI Copilot'}
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
                        onAskQuestion={(text) => {
                          setMobileTab('chat');
                          sendDirectMessage(text, activeId || result?.conversation_id || null);
                        }}
                      />
                    </div>

                    <div
                      className={`h-full flex-1 ${
                        mobileTab === 'chat' ? 'flex' : 'hidden md:flex'
                      }`}
                    >
                      {isLoading ? (
                        <LiveAgentProgress
                          progress={loadingProgress}
                          message={loadingLog}
                          logs={result?.agent_logs || []}
                        />
                      ) : (
                        <ChatPanel
                          chatHistory={chatHistory}
                          chatInput={chatInput}
                          isChatLoading={isChatLoading}
                          chatEndRef={chatEndRef}
                          onInputChange={setChatInput}
                          onSubmit={e => handleSendMessage(e, activeId || result?.conversation_id || null)}
                        />
                      )}
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
