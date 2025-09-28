import type { RazorpayOptions } from './razorpay';

export {};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}
