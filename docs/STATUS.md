# Project Status

## Product
- Product name: **Al-Huda**
- Internal codename: **Project Lantern**
- Current target release: **v1.0.0-beta**

## Overall State
The product is now working end to end as a deployed, authenticated, personalized beta experience.

## Completed

### Infrastructure / Setup
- GitHub repository created
- Netlify project created and connected
- Supabase project created
- frontend and backend environment files configured
- Quran Foundation API access requested and configured
- production content access working
- production deployment working

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
- profile page built
- settings page built
- privacy page built
- disclaimer page built
- header built
- footer built
- theme toggle built
- theme rollout completed across main pages
- chapter preview cards shortened and made clickable
- pathway cards visually improved
- helpful resources section added
- signed-in experience improved
- heading accent styling implemented across major pages

### Authentication
- Supabase Auth integrated
- Google sign-in working
- magic link sign-in working
- logout flow working
- protected routes working

### Persistence / Personalization
- onboarding persistence implemented
- reflection persistence implemented
- progress/history connected to saved data
- user-linked profiles implemented
- first name and last name collected during onboarding
- first-name personalization implemented across key pages
- journey progression stored per user
- streak tracking stored per user

### QA / Release Readiness
- Netlify deployment verified
- production auth flow verified
- successful QA completed across core flows

## Current v1 Beta Scope

Included:
- guided onboarding
- authenticated user flow
- personalized journey setup
- pathway-based daily journey flow
- live verse + translation
- save reflection
- per-user progress/history
- per-user progression
- streak tracking
- about page
- profile page
- settings page
- privacy page
- disclaimer page
- theme support
- polished app shell

Not included yet:
- editable profile details
- fully interactive settings controls
- auth-aware guided pathway CTA behavior on Home
- groups/friends/circles
- native mobile apps
- database-managed pathway authoring

## Branch Status
Current release branch:
- `feat/auth-and-profile`

Next planned branch:
- `feat/post-beta-polish`

## Release
Ship `v1.0.0-beta`.

Reason:
- the product now supports real users, real persistence, real progression, and successful QA
- the beta label accurately reflects that the product is highly functional but still evolving
- remaining work is mostly enhancement-oriented rather than core-flow blocking