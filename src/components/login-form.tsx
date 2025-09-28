"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Button } from './ui/button';

const emailSchema = z.object({ email: z.string().email('Enter a valid email address') });
const otpSchema = emailSchema.extend({ code: z.string().min(4, 'Enter the OTP sent to your inbox') });

type EmailForm = z.infer<typeof emailSchema>;
type OtpForm = z.infer<typeof otpSchema>;

type Step = 'EMAIL' | 'OTP';

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/dashboard';
  const [step, setStep] = useState<Step>('EMAIL');
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState<string>('');
  const [otpDevValue, setOtpDevValue] = useState<string | null>(null);

  const {
    register: registerEmail,
    handleSubmit: submitEmail,
    formState: { errors: emailErrors, isSubmitting: requesting },
  } = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });

  const {
    register: registerOtp,
    handleSubmit: submitOtp,
    setValue,
    formState: { errors: otpErrors, isSubmitting: verifying },
  } = useForm<OtpForm>({ resolver: zodResolver(otpSchema), defaultValues: { email: emailValue } });

  const onEmailSubmit = async ({ email }: EmailForm) => {
    setServerMessage(null);
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Unable to send OTP');
      }
      setEmailValue(email);
      setValue('email', email);
      setStep('OTP');
      if (data.otp) {
        setOtpDevValue(data.otp);
      }
      setServerMessage('OTP sent! Check your inbox (and spam) for a 6-digit code.');
    } catch (error) {
      setServerMessage(error instanceof Error ? error.message : 'Could not send OTP');
    }
  };

  const onOtpSubmit = async ({ email, code }: OtpForm) => {
    setServerMessage(null);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Invalid code');
      }
      router.push(next);
      router.refresh();
    } catch (error) {
      setServerMessage(error instanceof Error ? error.message : 'Verification failed');
    }
  };

  return (
    <div className="space-y-4">
      {step === 'EMAIL' && (
        <form onSubmit={submitEmail(onEmailSubmit)} className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              Email address
            </label>
            <Input type="email" id="email" placeholder="you@example.com" {...registerEmail('email')} />
            {emailErrors.email && <p className="text-xs text-rose-500">{emailErrors.email.message}</p>}
          </div>
          <Button type="submit" loading={requesting} className="w-full">
            Send OTP
          </Button>
        </form>
      )}

      {step === 'OTP' && (
        <form onSubmit={submitOtp(onOtpSubmit)} className="space-y-3">
          <input type="hidden" {...registerOtp('email')} />
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="code">
              Enter the 6-digit OTP
            </label>
            <Input type="text" id="code" maxLength={6} placeholder="000000" {...registerOtp('code')} />
            {otpErrors.code && <p className="text-xs text-rose-500">{otpErrors.code.message}</p>}
          </div>
          <Button type="submit" loading={verifying} className="w-full">
            Verify & sign in
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setStep('EMAIL');
              setOtpDevValue(null);
            }}
          >
            Back
          </Button>
        </form>
      )}

      {serverMessage && <p className="text-sm text-slate-600">{serverMessage}</p>}
      {otpDevValue && (
        <p className="text-xs text-emerald-600">Development OTP: {otpDevValue}</p>
      )}
    </div>
  );
};
