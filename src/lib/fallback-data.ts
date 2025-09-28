export const FALLBACK_COURSE = {
  id: 'fallback-course',
  slug: 'trading-masterclass',
  title: "Emporio Trading Orderflow Masterclass",
  subtitle: 'Orderflow, liquidity, and risk frameworks engineered for Indian traders who want conviction-based execution.',
  seoDescription:
    'Orderflow-driven trading education with secure video delivery, Razorpay checkout, and accountability systems tailored for Indian markets.',
  price: 199990,
  salePrice: 129990,
  currency: 'INR',
  durationInMin: 1800,
  isPublished: true,
  modules: [
    {
      id: 'fallback-module-1',
      title: 'Orientation & Mindset',
      description: 'Understand the roadmap, brokerage setup, compliance, and trading psychology.',
      order: 1,
      lessons: [
        {
          id: 'fallback-lesson-1',
          title: 'Welcome & Platform Tour',
          summary: 'Overview of the dashboard, community channels, and how to navigate lessons securely.',
          order: 1,
          durationInMin: 12,
          isPreviewable: true,
        },
        {
          id: 'fallback-lesson-2',
          title: 'Trading Psychology Primer',
          summary: 'Framework to manage emotions, set expectations, and build winning routines.',
          order: 2,
          durationInMin: 18,
          isPreviewable: false,
        },
      ],
    },
    {
      id: 'fallback-module-2',
      title: 'Swing Trading Blueprint',
      description: 'Learn setup selection, multi-timeframe analysis, and execution plans for equities.',
      order: 2,
      lessons: [
        {
          id: 'fallback-lesson-3',
          title: 'Price Action Foundations',
          summary: 'Decode structures, supply demand zones, and volume analysis.',
          order: 1,
          durationInMin: 24,
          isPreviewable: true,
        },
        {
          id: 'fallback-lesson-4',
          title: 'Case Study: NIFTY Swing',
          summary: 'Walkthrough of a profitable swing trade with position sizing.',
          order: 2,
          durationInMin: 20,
          isPreviewable: false,
        },
      ],
    },
    {
      id: 'fallback-module-3',
      title: 'Options Income Lab',
      description: 'Deploy weekly credit spreads, adjust positions, and manage risk using Greeks.',
      order: 3,
      lessons: [
        {
          id: 'fallback-lesson-5',
          title: 'Building a Delta-Neutral Base',
          summary: 'Construct neutral strategies and automation checkpoints.',
          order: 1,
          durationInMin: 28,
          isPreviewable: false,
        },
        {
          id: 'fallback-lesson-6',
          title: 'Live Adjustment Workshop',
          summary: 'Manage adjustments for Bank NIFTY spreads under volatility spikes.',
          order: 2,
          durationInMin: 33,
          isPreviewable: false,
        },
      ],
    },
  ],
};

export const getFallbackCourseBySlug = (slug: string) => {
  if (slug === FALLBACK_COURSE.slug) {
    return FALLBACK_COURSE;
  }
  return null;
};
