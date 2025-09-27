# Emporio Trading — Orderflow Masterclass Platform

Emporio Trading is a secure e-learning platform for Sanjai Mohanbabu’s trading community. It delivers orderflow-focused lessons, Razorpay-powered checkout, authenticated dashboards, encrypted video streaming, and marketing pages tailored to Indian traders.

## Tech stack
- **Framework:** Next.js App Router (TypeScript)
- **Styling:** Tailwind CSS
- **Database:** Prisma ORM with SQLite (dev)
- **Payments:** Razorpay integration
- **Video:** Secure playback placeholder ready for VdoCipher DRM
- **Auth:** OTP-based login with session/device tracking

## Local development
1. Install dependencies:
	```bash
	npm install
	```
2. Apply Prisma migrations and seed demo data:
	```bash
	npx prisma db push
	npm run seed
	```
3. Launch the dev server:
	```bash
	npm run dev
	```
4. Visit [http://localhost:3000](http://localhost:3000) to browse the site.

Environment variables such as `RAZORPAY_KEY_ID`, `VDOCIPHER_API_KEY`, and SMTP credentials should be defined in `.env` when connecting to live services.

## Project structure
- `src/app` — marketing, dashboard, learning, checkout, and API routes
- `src/components` — UI primitives, forms, layout, and video player
- `src/lib` — auth, payments, notifications, certificates, utils
- `prisma` — schema and seed data
- `content/blog` — MDX-ready blog posts

## Deployment
This repository is set up for GitHub Pages (`<username>.github.io`). To publish new changes:
```bash
npm run build
git push origin main
```

For a production database and video DRM, swap SQLite for a managed Postgres instance and connect to VdoCipher or a similar provider with the appropriate environment keys.
