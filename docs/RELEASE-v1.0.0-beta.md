# Release Notes — v1.0.0-beta

## Summary
This beta release establishes the first fully authenticated and personalized Al-Huda experience. Users can now sign in, complete onboarding, continue a guided pathway over multiple sessions, save reflections, build streaks, and return to a calmer, more welcoming daily Quran journey.

## Included in This Release

### Core Experience
- Home page
- About page
- Onboarding flow
- Journey page
- Progress page
- Profile page
- Settings page
- Privacy page
- Disclaimer page

### Authentication
- Supabase Auth integration
- Google sign-in
- email magic link sign-in
- logout flow
- protected authenticated routes

### Personalization
- first name and last name collected during onboarding
- user-linked profile data
- personalized signed-in experience
- returning users skip repeated onboarding

### Journey System
- pathway-based daily journey flow
- per-user journey progression
- step-by-step pathway continuation
- live chapter fetch
- live verse fetch
- live translation fetch

### Reflection and Progress
- save reflections
- save action steps
- user-linked progress history
- streak tracking
- latest progress snapshots

### UI / Product Shell
- polished header
- polished footer
- theme toggle
- light / dark / system support
- clickable chapter preview cards
- guided pathways section
- helpful learning resources section
- signed-in shell with dropdown menu
- gold / blue heading accent system

### Deployment
- Netlify deployment working
- production environment configured
- production auth flow verified
- successful QA completed

## Known Limitations
- guided pathway “Explore” button on Home should become auth-aware in the next version
- profile editing is not yet implemented
- settings are currently a shell and not yet fully interactive
- pathway content is curated in code and not yet admin-managed from a database
- circles / groups / social motivation features are not yet implemented
- native mobile apps are not yet implemented

## Why This Is a Beta
This release goes beyond alpha because it includes real authentication, real persistence, real progression, and successful end-to-end QA. However, it is still labeled beta because some next-version experience upgrades and deeper user controls are intentionally deferred.

## Next Planned Area
Next planned improvements include:
- smarter pathway CTA behavior
- editable profile details
- expanded settings
- deeper visual polish
- circles / shared journey features
- more pathway depth and flexibility

# Sign off
Ubaidullah Khan
`Project Lead - Dyne Labs`