# Quran.Foundation User API Integration

## Purpose
Minimal OAuth2 Authorization Code + PKCE connection flow for Quran.Foundation users and one user API verification call (Bookmarks).

## Redirect URIs
- Local: `http://localhost:8000/api/qf/oauth/callback`
- Production placeholder: `https://YOUR_BACKEND_DOMAIN/api/qf/oauth/callback`

## Environment Variables
- `QF_USER_SCOPES`
- `QF_OAUTH_REDIRECT_URI`

Default scopes:
- `openid offline_access bookmark`

## Backend Endpoints
- `/api/qf/oauth/start`
- `/api/qf/oauth/callback`
- `/api/qf/user/status`
- `/api/qf/user/bookmarks`

## User API Satisfied
- Bookmarks

## Testing Steps
1. Start backend/frontend with Quran.Foundation credentials.
2. Open `/qf-connect`.
3. Click **Connect Quran.Foundation** and complete hosted login.
4. Confirm redirect to `/qf-connect?connected=1`.
5. Click **Test User API**.
6. Verify bookmark JSON is returned.
7. If redirect URI/scopes are not enabled, verify clean error appears on `/qf-connect`.
