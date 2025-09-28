import Link from 'next/link';
import { LoginForm } from '../../components/login-form';
import { Card } from '../../components/ui/card';

export const metadata = {
  title: 'Secure Login',
  description: 'Access your trading courses via OTP-based login with device lock controls.',
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center gap-8 px-6 py-16">
      <Card className="w-full max-w-lg space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Login to your dashboard</h1>
          <p className="text-sm text-slate-600">OTP-based login keeps your account secure. We never store passwords.</p>
        </div>
        <LoginForm />
        <p className="text-xs text-slate-500">
          Need help? <Link href="mailto:support@tradingcoach.in" className="text-sky-600">Email support@tradingcoach.in</Link>
        </p>
      </Card>
    </div>
  );
}
