import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prismaOptional, isDatabaseEnabled } from '../../../lib/prisma';
import { formatCurrency } from '../../../lib/utils';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { getFallbackCourseBySlug } from '../../../lib/fallback-data';

const faqs = [
  {
    question: 'What payment modes are supported?',
    answer:
      'We accept UPI, Netbanking, all major credit/debit cards, and EMI plans through Razorpay. GST invoices are auto-emailed after purchase.',
  },
  {
    question: 'How do you secure video content?',
    answer:
      'All lessons stream via VdoCipher with DRM, dynamic watermarking, OTP-based playback, and two-device session limits.',
  },
  {
    question: 'Can I access future updates?',
    answer: 'Yes, your enrollment unlocks lifetime access to new modules, live labs, and downloadable resources.',
  },
  {
    question: 'Do you provide completion certificates?',
    answer:
      'Complete all modules and assessments to auto-generate a branded certificate, verified via blockchain-backed unique IDs.',
  },
];

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const course = isDatabaseEnabled && prismaOptional ? await prismaOptional.course.findUnique({ where: { slug: params.slug } }) : getFallbackCourseBySlug(params.slug);
  return {
    title: course ? `${course.title} — Course Overview` : 'Course',
    description: course?.seoDescription ?? course?.subtitle ?? 'Professional trading curriculum built for Indian markets.',
  };
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = isDatabaseEnabled && prismaOptional
    ? await prismaOptional.course.findUnique({
        where: { slug: params.slug },
        include: { modules: { include: { lessons: true }, orderBy: { order: 'asc' } } },
      })
    : getFallbackCourseBySlug(params.slug);

  if (!course || !course.isPublished) {
    notFound();
  }

  const price = formatCurrency(course.salePrice ?? course.price, course.currency);
  const originalPrice = course.salePrice ? formatCurrency(course.price, course.currency) : null;

  return (
    <div className="bg-white pb-20">
      <section className="bg-slate-950 py-16 text-slate-100">
        <div className="mx-auto max-w-6xl px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-black/40 px-3 py-1 text-xs font-semibold text-sky-400">
            In-depth curriculum
          </span>
          <div className="mt-6 grid gap-10 md:grid-cols-[2fr_1fr] md:items-start">
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold md:text-5xl">{course.title}</h1>
              <p className="text-base text-slate-300 md:text-lg">{course.subtitle}</p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                <span>{course.modules.length} modules</span>
                <span>{course.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons</span>
                {course.durationInMin && <span>{Math.round(course.durationInMin / 60)}+ hours</span>}
                <span>Includes certification</span>
              </div>
            </div>
            <Card className="space-y-4 bg-white/10 text-slate-100">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-400">Secure checkout</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold">{price}</span>
                  {originalPrice && <span className="text-sm line-through opacity-60">{originalPrice}</span>}
                </div>
                <p className="text-xs text-slate-300">UPI · Netbanking · EMI · GST Invoice</p>
              </div>
              <Button asChild>
                <Link href={`/checkout/${course.slug}`}>Enroll via Razorpay</Link>
              </Button>
              <p className="text-xs text-slate-400">
                Includes lifetime access, cohort recordings, and mentor Q&A support. 7-day structured onboarding.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-slate-900">Module-by-module breakdown</h2>
          <p className="text-sm text-slate-600">
            Lessons unlock sequentially. Preview lessons marked in blue are available before purchase.
          </p>
        </div>
        <div className="mt-10 space-y-6">
          {course.modules.map((module) => (
            <Card key={module.id} className="space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-sky-500">Module {module.order}</span>
                  <h3 className="text-2xl font-semibold text-slate-900">{module.title}</h3>
                </div>
                <span className="text-xs text-slate-500">{module.lessons.length} lessons</span>
              </div>
              <p className="text-sm text-slate-600">{module.description}</p>
              <ol className="space-y-3 text-sm text-slate-700">
                {module.lessons
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => (
                    <li key={lesson.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-400">L{lesson.order}</span>
                        <span className={lesson.isPreviewable ? 'text-sky-600' : 'text-slate-700'}>{lesson.title}</span>
                      </div>
                      <span className="text-xs text-slate-400">{lesson.durationInMin ?? 12} min</span>
                    </li>
                  ))}
              </ol>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-slate-100">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold">What you&apos;ll unlock</h2>
            <p className="mt-2 text-sm text-slate-300">
              Beyond the core curriculum, your dashboard includes premium indicators, trade journal templates, risk heatmaps, and Telegram community access.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-slate-200">
            <li>✔️ Secure HD streaming on VdoCipher with watermarking personalised to your login</li>
            <li>✔️ Progress tracker and lesson lock controls to maintain discipline</li>
            <li>✔️ Automated certificate generator with shareable verification link</li>
            <li>✔️ Affiliate dashboard to track referrals and payouts</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-semibold text-slate-900">Frequently asked questions</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.question}>
              <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
              <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
