'use client';

import Image from 'next/image';
import { ArrowRight, FlaskConical, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Footer } from '@/components/Footer';

export function LandingPage() {
  const { isConfigured, signInWithGoogle } = useAuth();
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      alert('Google sign in could not be started. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans">
      <main className="flex-1">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <Image
              src="/arqela-logo.png"
              alt="Arqela"
              width={42}
              height={42}
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold tracking-tight">Arqela</span>
          </div>
          <button
            onClick={handleSignIn}
            disabled={!isConfigured}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Sign in with Google
          </button>
        </header>

        <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-12 md:grid-cols-[1.2fr_0.8fr] md:items-center md:pt-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
              <FlaskConical className="h-3.5 w-3.5" />
              Scientific Research Stress Testing
            </div>
            <h1 className="max-w-3xl text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-[1.15]">
              Turn scientific claims into defensible, peer reviewed research.
            </h1>
            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-foreground/75">
              Arqela evaluates hypotheses through intelligent peer review, auditing core assumptions, surfacing unaddressed confounders, and crafting clear validation paths.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={handleSignIn}
                disabled={!isConfigured}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Get Started with Google <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {!isConfigured && (
              <p className="mt-4 text-xs font-medium text-warning bg-warning/10 border border-warning/20 rounded-md p-2.5 max-w-md">
                Environment setup: Add your Supabase keys to environment variables to enable Google authentication.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2">
            <Feature
              icon={<FlaskConical className="h-5 w-5" />}
              title="Methodological Audit"
              text="Deconstruct any hypothesis into explicit claims, underlying assumptions, and empirical predictions."
            />
            <Feature
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Counter Evidence & Confounders"
              text="Identify unaddressed bias, procedural risks, and missing control variables before submitting your paper."
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-4 border-b border-border py-4 last:border-0">
      <div className="text-primary mt-0.5 shrink-0">{icon}</div>
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm leading-normal text-foreground/70">{text}</p>
      </div>
    </div>
  );
}
