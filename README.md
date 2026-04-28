Presenting to you Project Lantern from Dyne Labs.  
🚧 Work in Progress

# Project Lantern

Project Lantern is the internal codename for a calm, guided daily reading and reflection experience built by **Dyne Labs**.

The current application delivers a structured flow where a user can:
- begin with guided onboarding
- enter a daily journey
- read live chapter and verse content
- view a live translation
- reflect privately
- save one small action step
- review past progress

## Current Status

Current milestone:
- working frontend and backend locally
- live content fetch through backend
- onboarding to journey personalization flow
- reflection saving and history view
- themed app shell with header, footer, about page, and progress page
- initial v1.0.0-alpha product experience in place

## Current Features

- responsive web interface
- guided onboarding flow
- personalized journey setup
- daily journey screen
- live chapter data
- live verse data
- live translation data
- saved reflections and action steps
- progress/history page
- about page
- light / dark / system theme toggle
- clickable chapter preview cards

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- FastAPI
- Python
- httpx

### Data / Persistence
- Supabase

### Hosting / Deployment
- Netlify

### Content Source
- Quran Foundation APIs

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

## Key Routes

### Frontend
- `/` - Home page
- `/onboarding` - Onboarding flow
- `/journey` - Daily journey page
- `/progress` - Progress/history page
- `/about` - About page

### Backend
- `/health` - Health check
- `/api/qf/chapters` - Chapter data endpoint

## Environment Files

Create:
- `frontend/.env.local`
- `backend/.env`

See `docs/SETUP.md` for full setup instructions.
- `docs/STATUS.md`
- `docs/WORK_LOG.md`
- `docs/ROADMAP.md`
- `docs/RELEASE-v1.0.0-alpha.md`

## Status

Current milestone:
- working frontend and backend locally
- live content fetch through backend
- onboarding to journey personalization flow
- reflection saving and history view
- themed app shell with header, footer, about page, and progress page
- initial v1.0.0-alpha product experience in place

## Team
Ubaidullah Khan
`Lead - Dyne Labs`
Built at Dyne Labs © 2026