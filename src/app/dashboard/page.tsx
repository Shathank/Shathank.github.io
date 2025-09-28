import Link from 'next/link';
import { format } from 'date-fns';
import { prisma } from '../../lib/prisma';
import { requireSession } from '../../lib/session';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { LogoutButton } from '../../components/logout-button';

const noData = <span className="text-xs text-slate-400">No data yet</span>;

export default async function DashboardPage() {
  const session = await requireSession();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      enrollments: {
        include: {
          course: { include: { modules: { include: { lessons: true } } } },
          certificate: true,
          lessonProgress: true,
        },
        orderBy: { enrolledAt: 'desc' },
      },
      deviceSessions: { orderBy: { lastActive: 'desc' }, take: 5 },
      payments: { orderBy: { createdAt: 'desc' }, take: 3 },
      affiliateProfile: true,
    },
  });

  if (!user) {
    return null;
  }

  type EnrollmentWithRelations = (typeof user)['enrollments'][number];
  type PaymentSummary = (typeof user)['payments'][number];
  type DeviceSummary = (typeof user)['deviceSessions'][number];

  const enrollments: EnrollmentWithRelations[] = user.enrollments;
  const payments: PaymentSummary[] = user.payments;
  const devices: DeviceSummary[] = user.deviceSessions;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Dashboard</p>
          <h1 className="text-3xl font-semibold text-slate-900">Welcome back, {user.name ?? user.email.split('@')[0]}</h1>
          <p className="text-sm text-slate-600">Track your courses, certificates, and affiliate earnings.</p>
        </div>
        <LogoutButton />
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        {enrollments.map((enrollment) => {
          const completedLessons =
            enrollment.lessonProgress?.filter(
              (progress: EnrollmentWithRelations['lessonProgress'][number]) => progress.watched,
            ).length ?? 0;
          const totalLessons = enrollment.course.modules.reduce(
            (count: number, module: EnrollmentWithRelations['course']['modules'][number]) =>
              count + module.lessons.length,
            0,
          );
          const progress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : Math.round(enrollment.progress);
          return (
            <Card key={enrollment.id} className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.2em] text-sky-500">Course</span>
                <h2 className="text-xl font-semibold text-slate-900">{enrollment.course.title}</h2>
              </div>
              <p className="text-xs text-slate-500">Progress: {progress}%</p>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{completedLessons}/{totalLessons} lessons</span>
                <span>Status: {enrollment.status}</span>
              </div>
              <Button asChild>
                <Link href={`/learn/${enrollment.course.slug}`}>Continue learning</Link>
              </Button>
              {enrollment.certificate ? (
                <Link
                  href={`/certificates/${enrollment.certificate.certificateNumber}`}
                  className="text-xs font-semibold text-sky-600"
                >
                  View certificate →
                </Link>
              ) : (
                <span className="text-xs text-slate-400">Complete 100% to unlock certificate</span>
              )}
            </Card>
          );
        })}
  {enrollments.length === 0 && (
          <Card className="md:col-span-3">
            <h2 className="text-lg font-semibold text-slate-900">No active courses yet</h2>
            <p className="mt-2 text-sm text-slate-600">Enroll now to start your trading transformation.</p>
            <Button asChild className="mt-4">
              <Link href="/courses/trading-masterclass">Browse courses</Link>
            </Button>
          </Card>
        )}
      </section>

      <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Recent payments</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {payments.length > 0
              ? payments.map((payment) => (
                  <li key={payment.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{payment.amount / 100} {payment.currency}</p>
                      <p className="text-xs text-slate-400">{format(payment.createdAt, 'dd MMM yyyy, HH:mm')}</p>
                    </div>
                    <span className="text-xs uppercase tracking-wide text-sky-600">{payment.status}</span>
                  </li>
                ))
              : noData}
          </ul>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Affiliate earnings</h2>
          {user.affiliateProfile ? (
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>Code: <span className="font-semibold text-slate-900">{user.affiliateProfile.code}</span></p>
              <p>Total earned: ₹{user.affiliateProfile.totalEarned / 100}</p>
              <p>Pending payout: ₹{(user.affiliateProfile.totalEarned - user.affiliateProfile.totalPaid) / 100}</p>
            </div>
          ) : (
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>Create your affiliate profile to earn 15% per referral.</p>
              <Button variant="ghost" className="mt-2 text-sky-600" asChild>
                <Link href="/dashboard/affiliate">Activate affiliate mode</Link>
              </Button>
            </div>
          )}
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Active devices</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            {devices.length > 0
              ? devices.map((device) => (
                  <li key={device.id}>
                    <p className="font-medium text-slate-800">{device.userAgent ?? 'Unknown device'}</p>
                    <p className="text-xs text-slate-400">Last active {format(device.lastActive, 'dd MMM yyyy HH:mm')}</p>
                  </li>
                ))
              : noData}
          </ul>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Need help?</h2>
          <p className="mt-2 text-sm text-slate-600">
            Join the weekly live Q&A or raise a support ticket for onboarding assistance, billing questions, or lesson feedback.
          </p>
          <Button asChild className="mt-4">
            <Link href="mailto:support@tradingcoach.in">Email support</Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
