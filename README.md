# PARVEX — Website + Admin CMS

Full-stack Next.js site with a custom admin dashboard/CMS: Projects, Services,
Website Content, Media Library, Messages, Leads, SEO, Analytics, Users, and
Settings — all backed by PostgreSQL via Prisma, media via Cloudinary, auth via
Better Auth, and transactional email via Resend.

- **Repository:** https://github.com/parthu0030/parvex
- **Studio contact:** parvex3303@gmail.com · +91 79900 32648 (call or WhatsApp)

Public contact details live in `src/data/company.ts` (`COMPANY`, `CONTACT_LINKS`);
change them there and every page — footer, contact page, CTAs, structured data —
updates together.

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Better Auth (email + password, admin-only, no public sign-up)
- **Media:** Cloudinary
- **Email:** Resend
- **Public site:** `src/app/(public)/*` — unchanged design, now content is CMS-driven
- **Admin:** `src/app/admin/*` — separate shell, separate auth, `noindex`

## 1. Install

Requirements: Node.js 20 or newer and access to a PostgreSQL database.

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

Fill in the variables in `.env` (see `.env.example`). `DATABASE_URL` is the
PostgreSQL connection string Prisma uses at runtime; `DIRECT_URL` is the direct
PostgreSQL connection string Prisma uses for migrations. For local Postgres,
these can be the same value. For a hosted database with a pooled connection,
use its direct/unpooled URL for `DIRECT_URL`. Both are required by
`prisma/schema.prisma`. Set the Better Auth secret and initial admin credentials
as well. Cloudinary and Resend are optional for running locally; uploads and
email notifications need their respective credentials.

## 3. Set up the database

```bash
npx prisma generate         # generates the typed Prisma Client from prisma/schema.prisma
npx prisma migrate dev --name init   # creates tables (first-time local setup)
npm run db:seed             # creates your first SUPER_ADMIN + migrates existing
                             # static project/service content into Postgres
```

If the database already has migrations applied, use `npx prisma migrate dev`
without `--name init`. For production, run `npx prisma migrate deploy` instead
of `migrate dev`.

## 4. Run it

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login` — sign in with the
  `PARVEX_INITIAL_ADMIN_EMAIL` / `PARVEX_INITIAL_ADMIN_PASSWORD` you set in
  `.env` before seeding.

Stop the development server with **Ctrl+C**. To run the optimized production
build locally, use `npm run build` followed by `npm run start`.

## What's in the Admin

| Section | What it does |
|---|---|
| **Dashboard** | Real counts — projects, messages, leads, media, SEO gaps. No fake numbers. |
| **Projects** | Full case-study CRUD: hero/cover/thumbnail media, challenge/solution/research/development narrative, tech stack, gallery, results, draft → published → archived workflow, SEO fields. Publishing revalidates the public site instantly. |
| **Services** | CRUD for the services shown on `/` and `/services`, with deliverables, outcome, media, and SEO. |
| **Website Content** | Editable hero copy, section headings, and final CTA for Homepage / Work / Services / Contact — without touching code. |
| **Media Library** | Every image lives in Cloudinary. Upload, tag by category, edit alt text, safe-delete (blocked if still referenced by a project/service/message). |
| **Messages** | Every Contact form submission, whether or not the notification email sends successfully. Mark read/replied/archived, convert to a Lead. |
| **Leads** | Simple pipeline (New → Qualified → Discussion → Proposal → Won/Lost) with notes. |
| **SEO** | Read-only audit across every published Project/Service/Page — flags missing or oversized meta titles/descriptions, links straight to the fix. |
| **Analytics** | Real first-party event counts (enquiries, project views, CTA clicks) plus optional GA/Clarity/Vercel Analytics provider IDs. |
| **Users** | SUPER_ADMIN only — create users, change roles (Super Admin / Admin / Editor), disable accounts. No public registration exists anywhere. |
| **Settings** | Company info, contact-form recipient, social links. |

## Roles

- **SUPER_ADMIN** — everything, including Users
- **ADMIN** — everything except Users
- **EDITOR** — Projects, Services, Media, Content; cannot delete or manage users

## Project structure

```
src/app/(public)/     Public marketing site — own layout/providers, DB-driven content
src/app/admin/        Admin — own layout, own auth gate, own shell (no public chrome)
src/app/api/auth/     Better Auth route handler
src/app/api/admin/    Media upload/list/delete route handlers
src/lib/auth/         Better Auth config + role-based authorization helpers
src/lib/storage/      Cloudinary abstraction + Media service (upload/delete/validate)
src/lib/queries/      Public read queries (published-only) + DB→UI adapters
prisma/schema.prisma  Full data model
prisma/seed.ts        Initial admin + one-time static→DB content migration
```

## Deploying

Any Node host works (Vercel, Railway, Fly, a VPS). Remember to:

1. Set every variable from `.env.example` in your host's environment settings.
2. Run `npx prisma migrate deploy` (not `migrate dev`) as part of your deploy step.
3. Run `npm run db:seed` once, the first time only.
