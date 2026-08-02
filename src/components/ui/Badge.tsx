import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'muted';
  className?: string;
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  success: 'bg-success/10 text-success border-success/20',
  danger:  'bg-danger/10  text-danger  border-danger/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  muted:   'bg-border-muted text-foreground/70 border-border',
};

/**
 * Compact label badge / pill. Colour is controlled by variant prop mapped
 * to CSS custom properties — no hardcoded hex values.
 */
export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
