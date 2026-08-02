import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-8 px-6 text-foreground/80">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-85 transition-opacity"
          title="Go to home"
        >
          <Image
            src="/arqela-logo.png"
            alt="Arqela"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <div>
            <span className="text-base font-semibold tracking-tight text-foreground">Arqela</span>
            <p className="text-xs text-foreground/60">
              Stress test scientific ideas and strengthen research hypotheses
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-foreground/50 gap-2">
        <p>© {new Date().getFullYear()} Arqela. All rights reserved.</p>
        <p className="text-center sm:text-right">
          Built for researchers and curious minds
        </p>
      </div>
    </footer>
  );
}
