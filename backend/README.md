# Prisma Backend

This backend hosts the Prisma data layer for the mobile app.

## Setup

```bash
copy .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

The default workspace setup uses a local SQLite database via `file:./dev.db` so the project can run without provisioning Postgres first.

If the Prisma migration engine is blocked by the local Windows environment, initialize the SQLite file directly with:

```bash
npm run db:init
```

## Endpoints

- `GET /api/health`
- `POST /api/users/upsert`
- `POST /api/medications`
- `PUT /api/logs/:id`
- `PUT /api/risk-scores/:userId`
- `POST /api/caregiver-alerts`
