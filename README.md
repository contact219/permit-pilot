# Permit Pilot

Know every permit before you break ground.

## Quick Start

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in values
3. Run: `docker-compose up --build`
4. App available at http://localhost (or https://localhost)
5. Seed initial data: `docker-compose exec app npm run db:seed`

## Development Mode

Run without Docker for faster iteration:
1. Start Postgres and Redis: `docker-compose up postgres redis`
2. Install deps: `npm install`
3. Run migrations: `npm run db:migrate`
4. Seed data: `npm run db:seed`
5. Start dev server: `npm run dev` (Vite + frontend) and `npm run server` (backend API)

## Tech Stack

- Frontend: React 18 + TypeScript + Vite + Wouter + Tailwind CSS + TanStack Query
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL 15 + Drizzle ORM
- Auth: Lucia Auth v3 (session-based)
- AI: Anthropic Claude API
- PDF: pdf-lib (form pre-fill) + pdfkit (checklist)
- Queue: BullMQ + Redis
- Scraper: Playwright (separate service)
- Reverse Proxy: Caddy

## Database Schema

See `db/schema.ts` for full schema. Key tables:
- `users`: User accounts with roles (contractor/homeowner/admin) and plan tiers
- `jurisdictions`: Cities/counties with permit portal info
- `permit_types`: Permit definitions per jurisdiction with required docs, fees, inspection stages
- `projects`: User projects with AI analysis results
- `project_permits`: Tracking of permit applications per project

## API Routes

- `GET /` - Landing page
- `GET /dashboard` - User dashboard (auth required)
- `GET /projects/new` - Multi-step project intake wizard
- `GET /projects/:id` - Project detail with permit list
- `POST /api/projects` - Create project, trigger AI analysis
- `GET /api/projects/:id` - Get project with permits
- `POST /api/projects/:id/analyze` - Re-run AI analysis
- `GET /api/export/:id/checklist` - Download PDF checklist
- `GET /api/export/:id/forms` - Download pre-filled permit forms (ZIP)
- `GET /api/jurisdictions/search` - Typeahead search
- `POST /api/auth/register` - Registration
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

## Adding a New Jurisdiction

1. Add the jurisdiction to `db/seeds/jurisdictions.json`
2. Run: `npm run db:seed:jurisdiction -- --name "City, TX"`
3. Verify data via admin panel at `/admin/jurisdictions` (future admin UI)

## License

Proprietary - All rights reserved.

## Disclaimer

This application provides informational permit guidance only. Always verify requirements directly with your local permitting authority. Permit Pilot is not responsible for errors or omissions in local requirement data or for any permit outcomes.