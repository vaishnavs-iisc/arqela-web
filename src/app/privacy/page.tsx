import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | Arqela',
  description: 'Learn how Arqela respects and protects your research data and privacy.',
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-foreground/60 mb-8">Last updated: August 2026</p>

        <div className="space-y-8 text-foreground/80 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>
              When you sign in to Arqela, we collect basic account details needed to run your account securely:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong>Account Profile:</strong> Name, email address, and profile picture provided through Google sign in.</li>
              <li><strong>Research Inputs:</strong> Hypotheses, scientific prompts, selected domains, and follow up questions you enter.</li>
              <li><strong>Session Data:</strong> Essential cookies and security tokens required to keep you signed in.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. How We Protect Your Data</h2>
            <p>
              Your research questions and conversation history belong to you. We use database isolation so your inputs remain private to your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. AI Processing</h2>
            <p>
              To evaluate scientific claims, your prompts are processed securely using high capability AI models. Your data is protected under enterprise privacy standards and is not used to train public models.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Storage and Security</h2>
            <p>
              All stored research data and session details are encrypted in transit and at rest using trusted cloud infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Getting in Touch</h2>
            <p>
              If you have any questions about your account data or privacy, please reach out to our team.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
