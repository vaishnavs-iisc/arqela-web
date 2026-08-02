import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service | Arqela',
  description: 'Terms of service and simple usage guidelines for Arqela.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
            <Image src="/arqela-logo.png" alt="Arqela" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="text-lg font-semibold tracking-tight">Arqela</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-foreground/60 mb-8">Last updated: August 2026</p>

        <div className="space-y-8 text-foreground/80 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Welcome to Arqela</h2>
            <p>
              By using Arqela, you agree to these simple terms. Arqela is built to help researchers, academics, and thinkers stress test ideas, explore assumptions, and design validation steps.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Research Disclaimer</h2>
            <p>
              Arqela uses advanced reasoning models to offer constructive feedback, highlight potential confounders, and suggest validation steps. These evaluations are designed to support your work, but they do not replace official peer review or expert clinical advice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Fair Use</h2>
            <p>
              Please use Arqela respectfully. You agree not to misuse the platform, attempt unauthorized access, or generate automated spam.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Ownership</h2>
            <p>
              You retain complete ownership of your research ideas and scientific text. Arqela processes your inputs solely to generate evaluations for your personal workspace.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
