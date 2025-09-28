import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { prisma } from '../lib/prisma';
import { formatCurrency } from '../lib/utils';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { NewsletterForm } from '../components/newsletter-form';
import { getFeaturedPosts } from '../lib/blog';

const testimonials = [
  {
    name: 'Aishwarya Menon',
    role: 'Bank NIFTY Scalper, Chennai',
    quote:
      'Orderflow finally showed me who was lifting the offers. I ditched guesswork and now scale in with clear absorption zones shared inside Emporio Trading.',
  },
  {
    name: 'Imran Shaikh',
    role: 'Prop Desk Lead, Hyderabad',
    quote:
      'The DOM replays and annotated trades inside the course helped my entire desk level up. Sanjai’s risk checklists are now part of our SOP.',
  },
  {
    name: 'Mitali Sharma',
    role: 'Swing & Wealth Builder, Delhi',
    quote:
      'Access-controlled videos, live orderflow labs, and the journaling dashboards gave me conviction to hold positions without panic exits.',
  },
];

const valuePillars = [
  {
    title: 'Orderflow Decoded',
    description: 'DOM, footprint charts, and liquidity maps broken down to help you read real intent behind every move.',
  },
  {
    title: 'Risk-First Execution',
    description: 'Position sizing matrices, volatility playbooks, and loss controls tuned for Indian equities & F&O.',
  },
  {
    title: 'Indian Market Context',
    description: 'INR pricing, GST invoices, Razorpay payments, and setups tailored to NSE cash, futures, and options.',
  },
  {
    title: 'Accountability Systems',
    description: 'Weekly Q&A, Telegram trade recaps, and dashboards that track expectancy, drawdowns, and streaks.',
  },
];

const trustLogos = [
  { name: 'VdoCipher DRM Partner', icon: '/trust/vdocipher.svg' },
  { name: 'Razorpay Secure Checkout', icon: '/trust/razorpay.svg' },
  { name: 'GST-Compliant Invoices', icon: '/trust/iso.svg' },
  { name: 'Orderflow Analytics Suite', icon: '/trust/nse.svg' },
];

export const revalidate = 60;

type ModuleWithLessons = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: { id: string; title: string; summary: string | null }[];
};

export default async function Home() {
  const course = await prisma.course.findFirst({
    where: { isPublished: true },
    include: { modules: { include: { lessons: true } } },
  });

  const posts = await getFeaturedPosts(2);

  const courseModules = (course?.modules ?? []) as ModuleWithLessons[];
  const totalLessons = courseModules.reduce((count, module) => count + module.lessons.length, 0);
  const courseDurationHours = course?.durationInMin ? Math.round(course.durationInMin / 60) : 0;

  return (
    <div className="space-y-20 pb-20">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
        <div className="absolute inset-0 opacity-40" aria-hidden>
          <Image src="/hero-grid.svg" alt="" fill priority className="object-cover" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-24 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-black/30 px-4 py-1 text-xs uppercase tracking-[0.3em] text-sky-400">
              Orderflow • Market Depth • Indian Markets
            </span>
            <h1 className="text-4xl font-semibold md:text-5xl">
              Trade with conviction using Emporio Trading&apos;s Orderflow Masterclass.
            </h1>
            <p className="max-w-2xl text-base text-slate-300 md:text-lg">
              Learn how Sanjai Mohanbabu reads market intent through volume, deltas, and liquidity so you can catch high-confidence intraday, scalping, and swing opportunities across NSE.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/courses/trading-masterclass">Explore the syllabus</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="#curriculum">View curriculum</Link>
              </Button>
            </div>
            <dl className="grid grid-cols-2 gap-6 text-sm text-slate-300 sm:grid-cols-4">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">Lessons</dt>
                <dd className="text-lg font-semibold text-white">{totalLessons}+</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">Hours of HD content</dt>
                <dd className="text-lg font-semibold text-white">{courseDurationHours}+</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">Secure devices</dt>
                <dd className="text-lg font-semibold text-white">Up to 2</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">Certificate</dt>
                <dd className="text-lg font-semibold text-white">Yes</dd>
              </div>
            </dl>
          </div>
          <Card className="relative flex w-full flex-1 flex-col gap-4 bg-white/5 text-slate-100 backdrop-blur lg:max-w-md">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">Course Snapshot</span>
            <h3 className="text-2xl font-semibold">{course?.title ?? 'Emporio Trading Orderflow Masterclass'}</h3>
            <p className="text-slate-300">
              {course?.subtitle ?? 'Orderflow, liquidity, and risk frameworks engineered for Indian traders who want conviction-based execution.'}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-200">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">One-time fee</p>
                <p className="text-lg font-semibold text-white">
                  {course ? formatCurrency(course.salePrice ?? course.price, course.currency) : '₹1,29,990'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">EMI Available</p>
                <p className="text-lg font-semibold text-white">Via Razorpay</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Access duration</p>
                <p className="text-lg font-semibold text-white">Lifetime</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Live cohorts</p>
                <p className="text-lg font-semibold text-white">Monthly</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/checkout/trading-masterclass">Enroll now in INR</Link>
            </Button>
            <p className="text-xs text-slate-400">
              Pay with UPI, Netbanking, Credit/Debit Cards, or Razorpay EMI. GST invoice included.
            </p>
          </Card>
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 pb-10 text-xs text-slate-400">
          {trustLogos.map((logo) => (
            <div key={logo.name} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full border border-slate-700 bg-slate-900/40" />
              <span>{logo.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16" id="mentor-showcase">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6 text-slate-700">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Meet your mentor</span>
            <h2 className="text-3xl font-semibold text-slate-900">Sanjai Mohanbabu — Founder, Emporio Trading</h2>
            <div className="space-y-5 text-sm leading-relaxed md:text-base">
              <div className="space-y-4">
                <h3 className="text-base font-semibold uppercase tracking-[0.2em] text-slate-500">My Journey into the Stock Market</h3>
                <p>
                  My name is Sanjai Mohanbabu, and like many young people, I once believed the stock market was too complex, too risky, and not for someone like me. But in 2020, when the markets crashed, my uncle — a trader since 2008 — told me to invest heavily in a few stocks. I wasn’t even 18 then, so I had to use my mother’s name to open a demat account. That decision changed the direction of my life.
                </p>
                <p>
                  At first, I was just curious, but curiosity soon grew into passion. I realized trading wasn’t about luck; it was about understanding what truly happens in the market.
                </p>
              </div>

              <p className="text-center text-xl text-slate-300">⸻</p>

              <div className="space-y-4">
                <h3 className="text-base font-semibold uppercase tracking-[0.2em] text-slate-500">My Struggles and Turning Point</h3>
                <p>
                  Like every beginner, I struggled. I tried looking at candles, charts, and indicators, but none of them gave me the clarity I wanted. I’m the kind of person who needs a reason behind every action, and the market often felt like guesswork.
                </p>
                <p>
                  That’s when my uncle introduced me to Orderflow trading. For the first time, I could actually see — who was buying, who was selling, how much volume was flowing into the market. Suddenly, trading stopped feeling like gambling and started feeling like logic. Orderflow became my turning point. It gave me conviction. It gave me a way to trade with confidence, not just hope.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-semibold uppercase tracking-[0.2em] text-slate-500">My Trading Focus Today</h3>
                <p>
                  Today, my trading revolves around intraday trading, scalping, and swing trading, with a clear focus on using stocks for long-term wealth building. This balanced approach allows me to grow steadily while staying true to the conviction Orderflow provides.
                </p>
                <p>
                  While I continue to grow as a trader, I realized one big truth: most traders don’t even know Orderflow exists. They struggle for years with indicators and strategies that never give them real conviction.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-semibold uppercase tracking-[0.2em] text-slate-500">Why I Teach</h3>
                <p>
                  That’s why I started Emporio Trading. My goal is simple — to educate and empower traders. Through YouTube and my courses, I want to make Orderflow understandable, practical, and actionable. I don’t just want to share knowledge; I want to shorten the learning curve and save others from the mistakes I made.
                </p>
              </div>

              <p className="text-center text-xl text-slate-300">⸻</p>

              <div className="space-y-4">
                <h3 className="text-base font-semibold uppercase tracking-[0.2em] text-slate-500">My Mission</h3>
                <p>
                  My mission is to help traders trade with clarity, not confusion. I want them to stop guessing and start trading with conviction — the same conviction that Orderflow gave me.
                </p>
                <p>
                  For me, trading is not just about money; it’s about freedom, discipline, and growth. And if my journey can inspire even one trader to keep going, then it’s all worth it.
                </p>
              </div>
            </div>
          </div>
          <Card className="overflow-hidden bg-slate-900/5 p-0 shadow-xl">
            <Image
              src="/branding/sanjai-mohanbabu.jpg"
              alt="Sanjai Mohanbabu smiling at his trading desk"
              width={768}
              height={1152}
              className="h-full w-full object-cover"
              priority
            />
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6" id="curriculum">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-slate-900">Curriculum that compounds your edge</h2>
            <p className="text-sm text-slate-600">
              Each module unlocks sequentially, with quizzes and live case studies to test your conviction.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/courses/trading-masterclass">See full course outline</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {courseModules.map((module) => (
            <Card key={module.id} className="h-full">
              <span className="text-xs uppercase tracking-wide text-sky-500">Module {module.order}</span>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{module.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{module.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {module.lessons.slice(0, 3).map((lesson) => (
                  <li key={lesson.id} className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-sky-500" aria-hidden />
                    <span>{lesson.title}</span>
                  </li>
                ))}
                {module.lessons.length > 3 && (
                  <li className="text-xs text-slate-400">+ {module.lessons.length - 3} more lessons</li>
                )}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-slate-100">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-sky-400">Why it works</span>
            <h2 className="mt-3 text-3xl font-semibold">The infrastructure that protects your course IP</h2>
            <p className="mt-3 text-sm text-slate-300">
              Combine secure video delivery, verified access, and Indian payment rails to launch a real business around your trading expertise.
            </p>
          </div>
          <div className="grid gap-4">
            {valuePillars.map((pillar) => (
              <Card key={pillar.title} className="bg-white/5 text-slate-100">
                <h3 className="text-lg font-semibold">{pillar.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{pillar.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="mb-8 space-y-2 text-center">
          <h2 className="text-3xl font-semibold text-slate-900">Traders who already made the shift</h2>
          <p className="text-sm text-slate-600">Read why professionals across India recommend this learning experience.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <p className="text-sm text-slate-700">“{testimonial.quote}”</p>
              <div className="mt-4 text-sm font-semibold text-slate-900">{testimonial.name}</div>
              <div className="text-xs text-slate-500">{testimonial.role}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-100 py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Ready to trade with certainty?</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Secure your seat in the next live cohort. Pay instantly in INR via Razorpay and unlock the full curriculum, dashboards, and certificate builder.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <Button asChild>
              <Link href="/checkout/trading-masterclass">Buy the Trading Masterclass</Link>
            </Button>
            <span className="text-xs text-slate-500">Includes lifetime updates, community access, and certificate upon completion.</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Latest trading intelligence</h2>
            <p className="text-sm text-slate-600">Free articles to sharpen your playbook. Updated weekly by the mentor desk.</p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/blog">View all posts</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Card key={post.slug}>
              <span className="text-xs uppercase tracking-wide text-sky-500">{format(post.publishedAt, 'PPP')}</span>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{post.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex items-center text-sm font-semibold text-sky-600">
                Read article →
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-slate-100">
        <div className="mx-auto max-w-4xl space-y-6 px-6 text-center">
          <h2 className="text-3xl font-semibold">Weekly alpha in your inbox</h2>
          <p className="text-sm text-slate-300">
            Join 12,000+ traders receiving execution-ready setups, risk alerts, and macro narratives every Monday morning.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
