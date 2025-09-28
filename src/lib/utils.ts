import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import crypto from 'crypto';
import slugify from 'slugify';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (amount: number, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'INR' ? 0 : 2,
  }).format(amount / 100);

export const generateOtp = (digits = 6) => {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

export const hashText = (text: string) =>
  crypto.createHash('sha256').update(text).digest('hex');

export const createSlug = (text: string) =>
  slugify(text, {
    lower: true,
    trim: true,
    strict: true,
  });

export const getDeviceHash = (userAgent = '', ipAddress = '') =>
  hashText(`${userAgent}-${ipAddress}`);

export const isProduction = () => process.env.NODE_ENV === 'production';
