import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { getSession } from '../lib/session';
import { prismaOptional } from '../lib/prisma';

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
  let user: { name: string | null; email: string } | null = null;

  if (session && prismaOptional) {
    const record = await prismaOptional.user.findUnique({ where: { id: session.userId } });
    if (record) {
      user = { name: record.name, email: record.email };
    }
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 text-slate-900 antialiased`}>
        <Header user={user} />
        <main className="min-h-[70vh] bg-slate-50/80">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
