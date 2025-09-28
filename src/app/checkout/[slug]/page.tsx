import { redirect } from 'next/navigation';
import { prismaOptional, isDatabaseEnabled } from '../../../lib/prisma';
import { getSession } from '../../../lib/session';
import { formatCurrency } from '../../../lib/utils';
import { Card } from '../../../components/ui/card';
import { CheckoutForm } from '../../../components/checkout-form';
import { getFallbackCourseBySlug } from '../../../lib/fallback-data';

export const metadata = {
  title: 'Secure Checkout',
  description: 'Complete your enrollment with Razorpay payments in INR.',
};

export default async function CheckoutPage({ params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session) {
    redirect(`/login?next=/checkout/${params.slug}`);
  }

  const course = isDatabaseEnabled && prismaOptional
    ? await prismaOptional.course.findUnique({ where: { slug: params.slug } })
    : getFallbackCourseBySlug(params.slug);
  if (!course) {
    redirect('/courses');
  }

  const user = isDatabaseEnabled && prismaOptional ? await prismaOptional.user.findUnique({ where: { id: session.userId } }) : null;
  const amount = course.salePrice ?? course.price;
  const priceDisplay = formatCurrency(amount, course.currency);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Card>
        <h1 className="text-3xl font-semibold text-slate-900">Complete your enrollment</h1>
        <p className="mt-2 text-sm text-slate-600">
          You are purchasing <span className="font-semibold">{course.title}</span>. Payments are securely processed via Razorpay.
        </p>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Payable today</p>
              <p className="text-2xl font-semibold text-slate-900">{priceDisplay}</p>
              {course.salePrice && (
                <p className="text-xs text-slate-400">Original price {formatCurrency(course.price, course.currency)}</p>
              )}
            </div>
            <ul className="space-y-2">
              <li>✔️ UPI · Netbanking · Cards · EMI available</li>
              <li>✔️ Instant access to dashboard and modules</li>
              <li>✔️ GST invoice emailed immediately</li>
              <li>✔️ 7-day onboarding with mentor support</li>
            </ul>
          </div>
          <CheckoutForm
            courseId={course.id}
            courseSlug={course.slug}
            amountLabel={priceDisplay}
            currency={course.currency}
            courseTitle={course.title}
            customerEmail={user?.email}
            phone={user?.phone}
          />
        </div>
      </Card>
    </div>
  );
}
