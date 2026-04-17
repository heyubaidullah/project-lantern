Presenting to you Project Lantern from Dyne Labs. 
🚧 Work in Progress

# Project Lantern

Project Lantern is a web application by **Dyne Labs** focused on creating a calm, guided daily reading journey around structured chapter and verse-based content.

## Current Features

- responsive web interface
- guided onboarding flow
- personalized journey setup
- daily journey screen
- backend integration for chapter data
- local onboarding persistence using browser storage

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- FastAPI
- Python
- Supabase

## Run Locally

### Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn python-dotenv httpx pydantic "pydantic-settings>=2" supabase
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Frontend runs on:

http://localhost:3000

### Backend runs on:

http://localhost:8000

### Key Routes
## Frontend
/
/onboarding
/journey
## Backend
/health
/api/qf/chapters
## Environment Files

Create:
- frontend/.env.local
- backend/.env

See docs/SETUP.md for full setup instructions.

### Status

## Current milestone:

- working frontend and backend locally
- external content fetch through backend
- onboarding to journey personalization flow
- initial product shell and UI direction in place

## Team

Built at Dyne Labs © 2026