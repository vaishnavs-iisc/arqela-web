import React from 'react';
import Image from 'next/image';
import { LogOut, History } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

interface AppHeaderProps {
  onLogoClick: () => void;
  onToggleMobileSidebar?: () => void;
}

export function AppHeader({ onLogoClick, onToggleMobileSidebar }: AppHeaderProps) {
  const { user, signOut } = useAuth();
  return (
    <header className="border-b border-border bg-card/95 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm z-20 shrink-0">
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg border border-border text-foreground/70 hover:bg-border-muted"
            title="Toggle Conversations"
          >
            <History className="h-4 w-4 text-primary" />
          </button>
        )}
        <div
          onClick={onLogoClick}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity"
          title="Go to Home"
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onLogoClick()}
        >
          <Image
            src="/arqela-logo.png"
            alt="Arqela"
            className="h-9 w-9 object-contain"
            width={36}
            height={36}
          />
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground leading-none">Arqela</h1>
            <p className="text-[11px] text-foreground/60 font-medium hidden sm:block mt-0.5">
              Scientific Hypothesis Stress Testing
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user?.email && (
          <span className="hidden md:inline text-xs text-foreground/60 font-medium max-w-[180px] truncate">
            {user.email}
          </span>
        )}
        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-primary hover:text-primary transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" /> <span className="hidden xs:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
