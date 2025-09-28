import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn('rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur', className)}>
    {children}
  </div>
);
