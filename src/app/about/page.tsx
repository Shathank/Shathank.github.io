import Image from 'next/image';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const milestones = [
  {
    year: '2014',
    title: 'Started prop trading desk',
    description: 'Managed a proprietary book focused on Bank NIFTY weekly options with a Sharpe of 2.3.',
  },
  {
    year: '2017',
    title: 'Coached 100+ traders',
    description: 'Launched offline workshops in Bengaluru and Mumbai with a structured options income framework.',
  },
  {
    year: '2020',
    title: 'Pivoted to digital',
    description: 'Built a digital-first curriculum with VdoCipher secure streaming to reach traders pan-India.',
  },
  {
    year: '2024',
    title: 'Trusted by 6,500+ learners',
    description: 'Scaled through Razorpay subscriptions, corporate tie-ups, and a growing affiliate network.',
  },
];

const credentials = [
  'SEBI registered research analyst',
  'NISM-Series-XIX-C Alternative Investment Certification',
  'Featured mentor at NSE Academy & FinLearn',
  'Guest speaker at CFA Society India & Moneycontrol Pro',
];

export const metadata = {
  title: 'About the Mentor',
  description: 'Meet the trader behind Trading Course India and discover the journey, philosophy, and credibility behind the curriculum.',
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600">
            Mentor Profile
          </span>
          <h1 className="text-4xl font-semibold text-slate-900">Hi, I&apos;m Sanjai Mohanbabu — the mentor behind Emporio Trading.</h1>
          <p className="text-base text-slate-600">
            My journey started in 2020 when I placed my first trades under my mother&apos;s demat account. Orderflow trading transformed guesswork into conviction, and now I blend that logic with disciplined intraday, scalping, and swing strategies tailor-made for Indian markets.
          </p>
          <p className="text-base text-slate-600">
            Emporio Trading is the culmination of thousands of market hours, annotated playbooks, and a relentless focus on risk. Every module is recorded in a studio, paired with live market labs, and secured with DRM so your investment — and intellectual property — stay protected.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Book a discovery call</Button>
            <Button variant="ghost">Download media kit</Button>
          </div>
        </div>
        <div className="flex-1">
          <Card className="overflow-hidden p-0">
            <Image
              src="/branding/sanjai-mohanbabu.jpg"
              alt="Sanjai Mohanbabu at the Emporio Trading desk"
              width={640}
              height={480}
              className="h-full w-full object-cover"
              priority
            />
          </Card>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-semibold text-slate-900">My trading philosophy</h2>
          <p className="mt-3 max-w-3xl text-base text-slate-600">
            Markets reward probabilistic thinking and disciplined execution. My approach blends swing and options income strategies with rigorous journaling, automation, and risk first principles. Expect deeper insight into why trades work, not just when to enter.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card>
              <h3 className="text-xl font-semibold text-slate-900">Structured Frameworks</h3>
              <p className="mt-2 text-sm text-slate-600">
                Tiered playbooks with checklists, liquidity filters, and trade management rules you can adopt instantly.
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold text-slate-900">Data-Driven Reviews</h3>
              <p className="mt-2 text-sm text-slate-600">
                Custom dashboards to review expectancy, drawdowns, and streaks so you always know what to tweak next.
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold text-slate-900">Risk Above All</h3>
              <p className="mt-2 text-sm text-slate-600">
                Protect capital with hedging matrices, VAR limits, and emergency playbooks for volatile macro events.
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold text-slate-900">Community & Accountability</h3>
              <p className="mt-2 text-sm text-slate-600">
                Weekly reviews, live labs, and accountability pods that keep you consistent every market cycle.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-semibold text-slate-900">Milestones along the journey</h2>
        <div className="mt-10 space-y-6 border-l-2 border-slate-200 pl-6">
          {milestones.map((milestone) => (
            <div key={milestone.year} className="relative pl-6">
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border border-slate-400 bg-white" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-500">{milestone.year}</p>
              <h3 className="text-lg font-semibold text-slate-900">{milestone.title}</h3>
              <p className="text-sm text-slate-600">{milestone.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:flex-row">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold">Credentials & credibility</h2>
            <p className="mt-2 text-sm text-slate-300">
              Trading education requires trust. Here are a few reasons learners and financial institutions rely on my playbooks.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-slate-200 md:w-1/2">
            {credentials.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-sky-500" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
