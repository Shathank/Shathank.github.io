"use client";

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export const LogoutButton = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    });
  };

  return (
    <Button variant="ghost" onClick={handleLogout} loading={pending}>
      Logout
    </Button>
  );
};
