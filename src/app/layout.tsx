import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { getSession } from '../lib/session';
import { prisma } from '../lib/prisma';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Emporio Trading — Orderflow Mastery for Indian Markets',
    template: '%s | Emporio Trading',
  },
  description:
    'Trade with conviction using Emporio Trading’s Orderflow Masterclass. Secure DRM video, Razorpay payments, liquidity labs, and accountability dashboards built for Indian traders.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Emporio Trading',
    description:
      'Orderflow-driven trading education with secure video delivery, Razorpay checkout, and personalised dashboards.',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    siteName: 'Emporio Trading',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emporio Trading',
    description:
      'Orderflow, liquidity, and risk-first trading education for Indian markets with secure streaming and Razorpay checkout.',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 text-slate-900 antialiased`}>
        <Header user={user ? { name: user.name, email: user.email } : null} />
        <main className="min-h-[70vh] bg-slate-50/80">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
