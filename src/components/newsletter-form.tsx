"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Button } from './ui/button';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

type FormValues = z.infer<typeof schema>;

export const NewsletterForm = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setStatus('submitting');
    setMessage(null);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, source: 'NEWSLETTER' }),
      });
      if (!response.ok) {
        throw new Error('Unable to subscribe');
      }
      setStatus('success');
      setMessage('Thanks! Check your inbox for the next trading insight.');
      reset();
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Could not subscribe right now. Try again in a bit.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        <Button type="submit" loading={status === 'submitting'}>
          Join the newsletter
        </Button>
      </div>
      {errors.email && <p className="text-sm text-rose-500">{errors.email.message}</p>}
      {message && (
        <p className={status === 'error' ? 'text-sm text-rose-500' : 'text-sm text-sky-600'}>{message}</p>
      )}
    </form>
  );
};
