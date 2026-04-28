
---

## `docs/STATUS.md`
```md
# Project Status

## Product
- Product name: **Al-Huda**
- Internal codename: **Project Lantern**
- Current target release: **v1.0.0-alpha**

## Overall State
The core MVP is working end to end.

## Completed

### Infrastructure / Setup
- GitHub repository created
- Netlify project created and connected
- Supabase project created
- frontend and backend environment files configured
- Quran Foundation API access requested and configured
- production content access working

### Backend
- FastAPI backend running locally
- chapter endpoint working
- verse endpoint working
- translation resources endpoint working
- translation endpoint working
- production Quran content integration working

### Frontend
- home page built
- onboarding flow built
- journey page built
- progress page built
- about page built
- header built
- footer built
- theme toggle built
- theme rollout completed across main pages
- chapter preview cards shortened and made clickable
- pathway cards visually improved

### Persistence
- onboarding persistence implemented
- reflection persistence implemented
- progress/history connected to saved data

## Current v1 Alpha Scope

Included:
- onboarding
- daily journey
- live verse + translation
- save reflection
- progress/history
- about page
- theme support
- polished app shell

Not included yet:
- full user authentication
- streak tracking
- user profile dropdown
- first-name personalization
- welcome/login landing page
- groups/friends
- native mobile apps

## Branch Status
Current frontend polish branch:
- `feat/frontend-dev`

Next planned branch:
- `feat/auth-and-profile`

## Release Recommendation
Ship `v1.0.0-alpha` without auth.

Reason:
- core experience is already strong
- auth adds significant scope
- alpha should validate the product flow first