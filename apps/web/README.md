# Petster Web

Current runtime for Petster.

This app contains:

- Next.js public website
- Payload CMS admin at `/admin`
- Payload API routes at `/api`
- Seed scripts for local content

## Run Locally

```bash
cd apps/web
npm install
cp ../../.env.example .env
npm run dev
```

Open:

- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## Seed Content

```bash
cd apps/web
npm run seed
```
