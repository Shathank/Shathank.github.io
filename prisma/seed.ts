import { prisma } from '../src/lib/prisma';
import { createSlug } from '../src/lib/utils';
import { ensureAdminSeedUser } from '../src/lib/auth';

const seed = async () => {
  await ensureAdminSeedUser();

  const courseTitle = 'Trading Course India: Professional Derivatives & Swing Trading Mastery';
  const slug = createSlug(courseTitle);

  const course = await prisma.course.upsert({
    where: { slug },
    update: {
      description:
        'A modern e-learning experience covering equities, futures & options, and risk & trade management tailored to Indian markets. Includes 40+ HD videos, case studies, live market labs, and downloadable playbooks.',
      isPublished: true,
    },
    create: {
      slug,
      title: courseTitle,
      subtitle: 'Structured, video-first education designed for Indian traders with live Razorpay checkout and secured streaming.',
      description:
        'A modern e-learning experience covering equities, futures & options, and risk & trade management tailored to Indian markets. Includes 40+ HD videos, case studies, live market labs, and downloadable playbooks.',
      heroImageUrl: '/images/course-hero.jpg',
      price: 199990,
      salePrice: 129990,
      currency: 'INR',
      level: 'Intermediate to Advanced',
      durationInMin: 1800,
      tags: {
        modules: ['Equities', 'Derivatives', 'Risk Management'],
      },
      isPublished: true,
      seoTitle: 'Trading Course India — Secure eLearning for Derivatives & Swing Trading',
      seoDescription:
        'Enroll in a professional Indian trading course with secure video hosting, Razorpay/UPI payments, and personalised dashboards.',
      modules: {
        create: [
          {
            title: 'Orientation & Mindset',
            description: 'Understand the roadmap, brokerage setup, compliance, and trading psychology.',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Welcome & Platform Tour',
                  order: 1,
                  summary: 'Overview of the dashboard, community channels, and how to navigate lessons securely.',
                  videoId: 'welcome-video-id',
                  durationInMin: 12,
                  watermarkText: 'Trader',
                },
                {
                  title: 'Trading Psychology Primer',
                  order: 2,
                  summary: 'Framework to manage emotions, set expectations, and build winning routines.',
                  videoId: 'psychology-video-id',
                  durationInMin: 18,
                  watermarkText: 'Mindset',
                },
              ],
            },
          },
          {
            title: 'Swing Trading Blueprint',
            description: 'Learn setup selection, multi-timeframe analysis, and execution plans for equities.',
            order: 2,
            lessons: {
              create: [
                {
                  title: 'Price Action Foundations',
                  order: 1,
                  summary: 'Decode structures, supply demand zones, and volume analysis.',
                  videoId: 'price-action-video',
                  durationInMin: 24,
                },
                {
                  title: 'Case Study: NIFTY Swing',
                  order: 2,
                  summary: 'Walkthrough of a profitable swing trade with position sizing.',
                  videoId: 'nifty-case-video',
                  durationInMin: 20,
                },
              ],
            },
          },
          {
            title: 'Options Income Lab',
            description: 'Deploy weekly credit spreads, adjust positions, and manage risk using Greeks.',
            order: 3,
            lessons: {
              create: [
                {
                  title: 'Building a Delta-Neutral Base',
                  order: 1,
                  summary: 'Construct neutral strategies and automation checkpoints.',
                  videoId: 'delta-neutral-video',
                  durationInMin: 28,
                },
                {
                  title: 'Live Adjustment Workshop',
                  order: 2,
                  summary: 'Manage adjustments for Bank NIFTY spreads under volatility spikes.',
                  videoId: 'adjustment-workshop-video',
                  durationInMin: 33,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      modules: { include: { lessons: true } },
    },
  });

  console.log(`Seeded course ${course.title}`);
};

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
