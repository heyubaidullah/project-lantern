```md
# Project Lantern Setup Guide

This guide explains how to set up and run Project Lantern locally.

## Prerequisites

Install the following first:

- Node.js
- npm
- Python 3
- pip

## Project Structure

```bash
project-lantern/
├── frontend/
│   ├── src/
│   └── .env.local
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── qf_client.py
│   └── .env
└── docs/
```

## 1. Frontend Environment

Create this file:

frontend/.env.local

Add:

NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

## 2. Backend Environment

- Create this file:

```bash
backend/.env
```
- Add:

APP_ENV=development
FRONTEND_URL=http://localhost:3000

QF_ENV=prelive
QF_AUTH_BASE_URL=YOUR_AUTH_BASE_URL
QF_API_BASE_URL=YOUR_API_BASE_URL
QF_CLIENT_ID=YOUR_CLIENT_ID
QF_CLIENT_SECRET=YOUR_CLIENT_SECRET

SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

## 3. Run the Backend

From the project root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn python-dotenv httpx pydantic "pydantic-settings>=2" supabase
uvicorn main:app --reload --port 8000

```

Health check:

```bash
http://localhost:8000/health
```

## 4. Run the Frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev

```

Open:

```bash
http://localhost:3000
```

## 5. Current Frontend Routes
/ → home
/onboarding → onboarding flow
/journey → personalized journey screen

## 6. Current Backend Routes
/health → service health check
/api/qf/chapters → chapter data endpoint

## Development Notes
- keep all secrets in .env files only
- do not commit .env or .env.local
- run frontend and backend together during development
- onboarding selections are currently stored in browser storage
- journey personalization depends on onboarding completion

## Deployment Direction
- Frontend: Netlify
- Backend: Railway
- Database: Supabase