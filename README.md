# BUSINESS ADD-ON – Event Management Platform

**Think Fast. Create Big. Build the Future.**

A complete, reusable full-stack event management website configured for the **BUSINESS ADD-ON** three-day business, innovation & entertainment festival in Mumbai.

Designed so college students with **no programming experience** can deploy it using only GitHub’s website and Vercel.

---

## What is included

- Premium dark + gold public website (Home, registration, ticket QR view)
- Dynamic ticket categories & registration with unique QR codes
- SPOC (Single Point of Contact) assignment shown on tickets
- PostgreSQL schema (Neon) covering events, tickets, speakers, sponsors, artists, challenges, RBAC, email logs, reminders, audit
- Seed data for BUSINESS ADD-ON (tickets, challenges, admin user)
- Auth.js (NextAuth) credentials login + role field
- Admin dashboard overview
- Vercel-ready configuration
- Vercel Blob ready for image uploads

---

## Student deployment (no terminal required)

### Step 1 – Download & extract
Download the project ZIP and extract it on your computer.

### Step 2 – Create a GitHub repository
1. Go to [github.com](https://github.com) and sign in.
2. Click **New repository**.
3. Name it e.g. `business-add-on` (public or private).
4. **Do not** initialise with README.
5. Click **Create repository**.
6. On the empty repo page click **uploading an existing file**.
7. Drag **all** the extracted project files and folders into the browser and commit.

### Step 3 – Create a Neon database
1. Go to [neon.tech](https://neon.tech) and create a free account.
2. Create a new project (choose a region close to India if available).
3. Click **Connect** and copy both:
   - **Pooled** connection string → `DATABASE_URL`
   - **Direct** connection string → `DATABASE_URL_UNPOOLED`

### Step 4 – Import into Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New… → Project**.
3. Import the GitHub repository you just created.
4. Before deploying, open **Environment Variables** and add:

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | (Neon pooled string) | Required |
| `DATABASE_URL_UNPOOLED` | (Neon direct string) | Required for Prisma |
| `AUTH_SECRET` | long random string | e.g. use a password generator |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Update after first deploy |
| `RESEND_API_KEY` | (from resend.com) | Optional for email |
| `RESEND_FROM_EMAIL` | verified sender | Optional |
| `RESEND_FROM_NAME` | BUSINESS ADD-ON | Optional |
| `BLOB_READ_WRITE_TOKEN` | (from Vercel Blob) | For image uploads |
| `CRON_SECRET` | another random string | Optional |

5. Click **Deploy**.

### Step 5 – Initialise the database
After the first successful deploy:

**Option A (recommended when you have Node later)**  
Run `npx prisma db push` and `npx prisma db seed` against the production `DATABASE_URL`.

**Option B (browser)**  
The project includes `/api/setup`. You can call it with the secret you set in `CRON_SECRET` / `AUTH_SECRET` to create the super-admin and base event if the database is empty.

Default admin after seed:
- **Email:** `admin@businessaddon.in`
- **Password:** `Admin@12345`  
**Change this password immediately.**

### Step 6 – Update `NEXT_PUBLIC_APP_URL`
Once you know your Vercel URL, add/update the environment variable and redeploy so QR codes point to the correct domain.

---

## Local development (optional, for developers)

```bash
npm install
cp .env.example .env.local
# fill in DATABASE_URL etc.
npx prisma db push
npx prisma db seed
npm run dev
```

---

## Architecture summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 App Router, React 19, TypeScript, Tailwind |
| Backend | Next.js Route Handlers / Server Actions |
| Database | Neon Serverless PostgreSQL + Prisma |
| Auth | Auth.js (NextAuth v5) Credentials + JWT |
| Email | Resend (optional) |
| Images | Vercel Blob |
| Hosting | Vercel |
| QR | `qrcode` library |

---

## Design direction

- Midnight / near-black base (`#0a0a0f`)
- Metallic gold accent (`#d4af37`)
- Deep navy / blue supporting colours
- Editorial, premium business + entertainment aesthetic
- Mobile-first

---

## Important notes from the specification

- No speaker, artist, sponsor or celebrity is shown as **Confirmed** unless an administrator has marked the record as confirmed.
- Venue, dates and attendance numbers remain configurable and must not be presented as final until approved.
- Challenge prizes / funding / investment are never guaranteed unless formally confirmed.
- The platform is reusable: change event name, colours, tickets, challenges etc. from the admin side (full CRUD modules are the next extension layer).

---

## Next modules to complete (roadmap)

1. Full CRUD for Speakers, Sponsors, Artists, Challenges, SPOCs
2. Dynamic registration form builder
3. Resend email templates + campaigns + reminder cron
4. QR scanner / check-in interface for staff
5. CSV exports & reporting
6. Sponsor enquiry form + CRM pipeline
7. Vercel Blob upload UI for logos / banners

The database schema and seed already support these features; the UI and API routes can be added incrementally without changing the student deployment flow.

---

## Support

If the build fails on Vercel, check:
1. All required environment variables are present.
2. Neon database is active and the connection strings are correct (pooled vs direct).
3. Build logs for Prisma generate errors.

---

**Tagline:** Think Fast. Create Big. Build the Future.
