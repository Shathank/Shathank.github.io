"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export const LessonActions = ({
  lessonId,
  nextLessonHref,
  initialCompleted,
}: {
  lessonId: string;
  nextLessonHref?: string;
  initialCompleted: boolean;
}) => {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const toggleComplete = async (value: boolean) => {
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch('/api/progress/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, watched: value }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Unable to update progress');
      }
      setCompleted(value);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not update progress');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant={completed ? 'secondary' : 'primary'} loading={pending} onClick={() => toggleComplete(!completed)}>
          {completed ? 'Mark as incomplete' : 'Mark lesson complete'}
        </Button>
        {nextLessonHref && (
          <Button variant="ghost" onClick={() => router.push(nextLessonHref)}>
            Next lesson →
          </Button>
        )}
      </div>
      {message && <p className="text-sm text-rose-500">{message}</p>}
      {completed && <p className="text-xs text-emerald-600">Progress updated. Keep the momentum!</p>}
    </div>
  );
};
