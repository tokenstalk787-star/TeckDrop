# TeckDrop

Airdrop intelligence platform for discovering, verifying, and tracking crypto opportunities.

## MVP stack

Next.js App Router, TypeScript, Tailwind CSS, Prisma, MySQL/TiDB-compatible MySQL, Zod, Lucide React.

## Current product

TeckDrop follows **Find → Verify → Track → Farm** and is designed as a 2027 Airdrop Hunter OS.

- Database-backed airdrop directory
- Evidence-backed intelligence score using reward, effort, cost, risk, longevity and verification confidence factors
- Step-by-step task checklists with optional official task URLs
- Local hunter progress, readiness state, daily summary, streak and active farming session
- Local tracked-opportunity watchlist
- Snapshot/deadline calendar
- Daily hunter feed
- Protected admin CMS for airdrops, categories and intelligence analytics
- Dynamic sitemap, public Intelligence Center, deadline/snapshot status and external URL safety validation

## Admin

Set `ADMIN_PASSWORD` in `.env.local`, then open `/admin/login`.

The admin password must never be committed to GitHub. Use a strong random value in local and Vercel environment variables.

## Intentionally deferred infrastructure

The current product is deliberately server-rendered with Next.js + Prisma/MySQL and local hunter state. Express APIs, blockchain/RPC integration, wallet connection, automated discovery, AI agents, Redis queues, persistent user accounts and push/Telegram alerts remain the next infrastructure layer after the current product is validated. The UI and data model are structured so those services can be added without replacing the core workflow.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Add your MySQL/TiDB `DATABASE_URL`.
3. Set `ADMIN_PASSWORD`.
4. Set `NEXT_PUBLIC_SITE_URL`.
5. Run `npm install`.
6. Run `npm run db:generate`.
7. Run `npm run db:push`.
8. Run `npm run db:seed` for development seed data.
9. Run `npm run dev`.

## Product direction

TeckDrop is being built as a 2027 Airdrop Hunter OS:

**Find → Verify → Track → Farm**

Future phases will add eligibility intelligence, calendar automation, alerts, automated discovery, scam/phishing protection, analytics, API access and eventually blockchain/on-chain intelligence.
