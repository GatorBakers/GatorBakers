# GatorBakers

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ACCESS_TOKEN_SECRET` | Secret for signing access tokens | Yes |
| `REFRESH_TOKEN_SECRET` | Secret for signing refresh tokens | Yes |

### Client (`client/.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend API URL (defaults to `http://localhost:4000`) | No |

## Getting Started

### One-Command Local Startup (Recommended)

From the repository root:

```bash
npm install
npm run dev:all
```

This starts:

- MeiliSearch (prefers local `server/meilisearch(.exe)`, falls back to Docker)
- Backend API (`server/index.ts`)
- Frontend Vite dev server (`client`)

If Docker is used for MeiliSearch, make sure Docker Desktop is running.

### One-Command Test Run

From the repository root:

```bash
npm run test:all
```

This runs server tests and also runs client tests when a client `test` script is present.

### Frontend

1. Navigate to the frontend directory:

```bash
cd Client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```