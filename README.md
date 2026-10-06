# TeckDrop

Airdrop intelligence platform for discovering, verifying, and tracking crypto opportunities.

## MVP stack

Next.js App Router, TypeScript, Tailwind CSS, Prisma, MySQL/TiDB-compatible MySQL, Zod, Lucide React.

## Current product

- Database-backed airdrop directory
- Verification, risk, difficulty and opportunity score
- Step-by-step task checklists
- Local hunter progress
- Local tracked-opportunity watchlist
- Snapshot/deadline calendar
- Daily hunter feed
- Protected admin CMS for airdrops and categories
- Dynamic sitemap from published database records

## Admin

Set `ADMIN_PASSWORD` in `.env.local`, then open `/admin/login`.

The admin password must never be committed to GitHub. Use a strong random value in local and Vercel environment variables.

## Deferred

Express backend, blockchain/RPC integration, wallet connection, automated scraping, AI agents, Redis, alerts and on-chain eligibility are intentionally deferred until the core product workflow is complete.

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
