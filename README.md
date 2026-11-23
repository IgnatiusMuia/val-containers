# Val Containers

Marketing and catalogue site for Val Containers, a Nairobi-based shipping container dealer.

## Stack

- Next.js 16 (App Router, Cache Components)
- React 19
- Tailwind CSS 4
- TypeScript

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev          # development server
npm run lint         # ESLint
npm run build        # production build
npm run start        # production server
npm run media:import # rebuild public/media from the source folder
npm run media:check  # verify every local media reference exists
npm run db:seed      # copy static listings into Supabase (safe to re-run)
npm run admin:invite # allowlist an Auth user by email
```

## Media pipeline

The site ships with local media in `public/media`. Seeded catalogue rows point at
those local files. Admin uploads are stored in the public Supabase
`container-media` bucket and served from the project's public storage URL.
Customer photos attached to enquiries go to the private `enquiry-media` bucket
and are shown to admins through short-lived signed URLs.

```
public/media/images/   # JPG photos, grouped by yard, interiors, homes, delivery
public/media/videos/   # MP4 videos
public/media/manifest.json
```

The master files live outside the repository at
`/Users/ignatiusmbitimuia/Desktop/Vallery`. `scripts/media-map.json` maps each
source file to its output name, alt text and category.
`scripts/import-media.mjs` uses `sharp` to resize and compress the photos, copies
the hero video, generates the hero poster and branded placeholder, and writes the
manifest.

Run the import again after changing the source folder or map:

```bash
npm run media:import
npm run media:check
```

`media:check` scans `app`, `components`, `data` and `lib` for local media
references and fails if a file is missing or an Unsplash URL remains.

### Where filenames live

| Media | Edit this file | Example |
| --- | --- | --- |
| Container gallery | `data/containers.ts` | `image("yard/container-stack.jpg", "…")` |
| Container video | `data/containers.ts` | `video("hero-yard.mp4", "…", "hero-poster.jpg")` |
| Use case photos | `data/use-cases.ts` | `img("interiors/office-interior.jpg", "…")` |
| Blog images | `data/blog.ts` | `img("homes/container-home-exterior.jpg", "…")` |
| Hero video + poster | `data/media.ts` | `/media/videos/hero-yard.mp4` |

Container images and videos can be mixed in the same `media` array. The third
argument to `video()` is the poster image shown before playback.

These files describe the seed catalogue. Once Supabase is configured, edit
listings and media from `/admin` instead of editing `data/containers.ts`.

### Representative photos

Some listings use yard examples rather than photos of the exact unit. Set
`photosAreRepresentative: true` on the container so the card, gallery and
listing page show the “Yard example” label and the exact-unit disclaimer.

### Hero video

`data/media.ts` points at `hero-yard.mp4` and `hero-poster.jpg`. The poster is a
representative yard still with no people. The component only loads the video on
desktop, fast connections and when reduced motion is off. Phones, slow
connections and reduced-motion users get the poster only.

### Recommended file sizes

- Photos: 1600–2400 px on the long edge, compressed JPG/WebP, ideally under
  500 KB each.
- Videos: MP4 (H.264), 1080p, 10–20 seconds, compressed to roughly 5–8 MB.
- Keep filenames lowercase, hyphenated and free of spaces.

If a file is missing, the site shows a branded placeholder instead of a broken
image.

## Environment

Set `NEXT_PUBLIC_SITE_URL` to the deployed origin in production so canonical
URLs, Open Graph metadata and the sitemap use the correct domain.

```bash
NEXT_PUBLIC_SITE_URL=https://val-containers.vercel.app
```

## Admin and Supabase

Supabase is the only source for the public catalogue, FAQs, gallery,
announcements and editable page copy. `data/containers.ts` and `data/faqs.ts`
remain the seed inputs for `npm run db:seed`, but they are not used as a runtime
fallback. If Supabase is not configured, or a query fails, the catalogue, FAQs
and gallery render empty rather than showing stale seed data. Site settings fall
back to the defaults in `data/site.ts`.

The admin area at `/admin` includes:

- **Inventory** — create, edit, duplicate and archive listings; draft/published/archived
  publication states; `available`, `reserved`, `sold`, `unavailable` and
  `inspection` availability; cover media; verification details.
- **Enquiries** — inbox, statuses, notes, quotations and photo attachments with
  reference numbers. The old `leads` table is no longer used by the admin UI.
- **Media** — search across uploaded photos and videos, edit alt text, set covers
  and delete files.
- **Content** — page copy with draft/publish, FAQs and the yard gallery.
- **Settings and team** — owner-only contact details, announcement bar, and team
  invitations with per-area permissions (`inventory`, `media`, `enquiries`,
  `content`).

Access requires an active row in `public.admin_users`. Admin sessions sign out
after 8 hours of inactivity, and both email/password and magic-link sign-in are
supported. The magic-link and password-reset callback is `/auth/callback`.

Add these to `.env.local` and to the Vercel project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The Vercel Marketplace Supabase integration uses the newer names
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY`. The app accepts
either the legacy or Marketplace key names.

The service/secret key is server-only. Never expose it with a `NEXT_PUBLIC_`
prefix or import it into a Client Component. Enquiry attachments, login rate
limiting and team management also require it at runtime.

### First-time setup

1. Create a Supabase project, or install the Supabase integration from the
   Vercel Marketplace and connect it to this Vercel project.
2. Apply the migrations in order from the SQL editor:

   ```text
   supabase/migrations/202611230001_initial.sql
   supabase/migrations/202611240001_admin_cms.sql
   supabase/migrations/202611240002_availability_status.sql
   supabase/migrations/202611240003_public_inspection.sql
   ```

3. Add the environment variables above to `.env.local` and to the Vercel
   project.
4. Seed the listings and their local media. New rows are inserted as published
   listings. Re-running this is safe: existing listings and uploaded media are
   left untouched.

   ```bash
   npm run db:seed
   ```

5. Create the owner account in **Authentication → Users**, then add that user
   to the allowlist:

   ```sql
   insert into public.admin_users (user_id, role)
   values ('<auth-user-uuid>', 'owner');
   ```

   You can also invite and allowlist an email in one step:

   ```bash
   npm run admin:invite -- owner@example.com owner
   ```

6. Reload the app and sign in at `/admin/login`. Owners can then invite the
   rest of the team from **Settings → Team**.

The migrations create the inventory, enquiry, content, team and audit tables,
RLS policies, the `auth_rate_limits` table, the public `container-media` bucket
and the private `enquiry-media` bucket. Public requests can read published
containers with `available`, `reserved` or `inspection` availability only;
`sold` and `unavailable` listings stay private. The admin allowlist controls
writes.

The CMS migration seeds the starting FAQs, gallery items, page copy and site
settings, so the public site has content immediately after setup. Edit those
from `/admin` afterwards.
