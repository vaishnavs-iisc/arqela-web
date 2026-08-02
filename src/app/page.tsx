'use client';

import { LandingPage } from '@/components/LandingPage';
import { ResearchWorkspace } from '@/components/ResearchWorkspace';
import { useAuth } from '@/components/AuthProvider';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-background" />;
  return user ? <ResearchWorkspace /> : <LandingPage />;
}
