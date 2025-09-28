import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Course', href: '/courses/trading-masterclass' },
  { name: 'Blog', href: '/blog' },
  { name: 'Dashboard', href: '/dashboard' },
];

export const Header = ({
  theme = 'light',
  user,
}: {
  theme?: 'light' | 'dark';
  user: { name: string | null; email: string } | null;
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70',
        theme === 'dark' && 'border-transparent bg-slate-900/80 text-slate-100',
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <span className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-white">
            <Image
              src="/branding/emporio-logo.svg"
              alt="Emporio Trading emblem"
              fill
              priority
              sizes="40px"
              className="object-contain p-1"
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span>Emporio Trading</span>
            <span className="text-xs font-normal uppercase tracking-[0.4em] text-slate-500">By Sanjai Mohanbabu</span>
          </span>
        </Link>
        <nav
          className={cn(
            'hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex',
            theme === 'dark' && 'text-slate-200',
          )}
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'transition hover:text-slate-900',
                theme === 'dark' && 'hover:text-white',
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <span
              className={cn(
                'hidden text-sm font-medium text-slate-700 md:inline',
                theme === 'dark' && 'text-slate-100',
              )}
            >
              Welcome, {user.name ?? user.email.split('@')[0]}
            </span>
          ) : (
            <Button
              variant="ghost"
              asChild
              className={cn('text-slate-700 hover:text-slate-900', theme === 'dark' && 'text-slate-100 hover:text-white')}
            >
              <Link href="/login">Login</Link>
            </Button>
          )}
          <Button asChild className="bg-sky-600 text-white hover:bg-sky-500">
            <Link href="/checkout/trading-masterclass">Enroll Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
