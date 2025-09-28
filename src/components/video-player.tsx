"use client";

import { useEffect, useState } from 'react';

export const VideoPlayer = ({ lessonId, title }: { lessonId: string; title: string }) => {
  const [state, setState] = useState<
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'ready'; otp: string; playbackInfo: string }
  >({ status: 'loading' });

  useEffect(() => {
    const fetchOtp = async () => {
      try {
        const response = await fetch('/api/videos/otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error ?? 'Unable to load secure video');
        }
        setState({ status: 'ready', otp: data.otp, playbackInfo: data.playbackInfo });
      } catch (error) {
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Could not initialise video',
        });
      }
    };

    fetchOtp();
  }, [lessonId]);

  if (state.status === 'loading') {
    return (
      <div className="flex h-[480px] w-full items-center justify-center rounded-3xl bg-slate-900/80 text-slate-300">
        Loading secure video...
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="flex h-[480px] w-full items-center justify-center rounded-3xl bg-rose-50 text-rose-500">
        {state.message}
      </div>
    );
  }

  const embedUrl = `https://player.vdocipher.com/v2/?otp=${encodeURIComponent(state.otp)}&playbackInfo=${encodeURIComponent(state.playbackInfo)}`;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
      <iframe
        title={title}
        src={embedUrl}
        allow="encrypted-media"
        allowFullScreen
        className="h-[480px] w-full"
      />
    </div>
  );
};
