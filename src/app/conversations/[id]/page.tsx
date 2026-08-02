'use client';

import { ResearchWorkspace } from '@/components/ResearchWorkspace';
import { LandingPage } from '@/components/LandingPage';
import { useAuth } from '@/components/AuthProvider';

export default function ConversationPage() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-background" />;
  return user ? <ResearchWorkspace /> : <LandingPage />;
}
