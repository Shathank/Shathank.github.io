import Link from 'next/link';
import { format } from 'date-fns';
import { assertAdmin } from '../../lib/session';
import { prisma } from '../../lib/prisma';
import { Card } from '../../components/ui/card';

export const metadata = {
  title: 'Admin Console',
  description: 'Monitor enrollments, payments, and content from a single dashboard.',
};

export default async function AdminPage() {
  await assertAdmin();

  const [userCount, activeEnrollments, paymentStats, recentLeads] = await Promise.all([
    prisma.user.count(),
    prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
    prisma.payment.groupBy({
      by: ['status'],
      _sum: { amount: true },
    }),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const revenue = paymentStats.find((stat) => stat.status === 'SUCCESS')?._sum.amount ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-sky-500">Admin</p>
        <h1 className="text-3xl font-semibold text-slate-900">Platform control centre</h1>
        <p className="text-sm text-slate-600">Review user growth, revenue, and leads at a glance. Manage content from the sidebar.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Total users</p>
          <p className="text-3xl font-semibold text-slate-900">{userCount}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Active enrollments</p>
          <p className="text-3xl font-semibold text-slate-900">{activeEnrollments}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Lifetime revenue (INR)</p>
          <p className="text-3xl font-semibold text-slate-900">₹{revenue / 100}</p>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Recent leads</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {recentLeads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{lead.email}</p>
                  <p className="text-xs text-slate-400">{format(lead.createdAt, 'dd MMM yyyy HH:mm')}</p>
                </div>
                <span className="text-xs uppercase tracking-wide text-slate-400">{lead.source}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/admin/videos" className="text-sky-600">Upload new lesson →</Link>
            </li>
            <li>
              <Link href="/admin/certificates" className="text-sky-600">Generate certificate →</Link>
            </li>
            <li>
              <Link href="/admin/affiliates" className="text-sky-600">Manage affiliates →</Link>
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
