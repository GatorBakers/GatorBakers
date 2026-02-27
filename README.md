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