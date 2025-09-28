"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import type { RazorpayOptions } from '../types/razorpay';

const loadRazorpay = () =>
  new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') return;
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });

export const CheckoutForm = ({
  courseId,
  courseSlug,
  amountLabel,
  currency,
  courseTitle,
  customerEmail,
  phone,
}: {
  courseId: string;
  courseSlug: string;
  amountLabel: string;
  currency: string;
  courseTitle: string;
  customerEmail?: string;
  phone?: string | null;
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setStatus('loading');
      setError(null);

      await loadRazorpay();

      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, paymentType: 'ONE_TIME' }),
      });

      if (!orderResponse.ok) {
        throw new Error('Unable to create order');
      }

      const data = await orderResponse.json();
      if (!data.success) {
        throw new Error(data.error ?? 'Could not initiate payment');
      }

      const options: RazorpayOptions = {
        key: data.razorpayKey,
        amount: data.order.amount,
        currency,
        name: 'Trading Course India',
        description: courseTitle,
        order_id: data.order.id,
        prefill: {
          email: customerEmail,
          contact: phone ?? undefined,
        },
        notes: {
          courseSlug,
        },
        theme: { color: '#0f172a' },
        handler: async (response: Record<string, string>) => {
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok || !verifyData.success) {
            setStatus('error');
            setError(verifyData.error ?? 'Payment verification failed');
            return;
          }
          setStatus('success');
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
  };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Payment failed');
    }
  };

  return (
    <div className="space-y-3">
      <Button onClick={handleCheckout} loading={status === 'loading'} className="w-full">
        Pay {amountLabel}
      </Button>
      {status === 'success' && (
        <p className="text-sm text-emerald-600">Payment successful! Access unlocked in your dashboard.</p>
      )}
      {status === 'error' && error && <p className="text-sm text-rose-500">{error}</p>}
      <p className="text-xs text-slate-500">
        Payments are secured via Razorpay with bank-grade encryption. You will receive an email and SMS confirmation after a successful transaction.
      </p>
    </div>
  );
};
