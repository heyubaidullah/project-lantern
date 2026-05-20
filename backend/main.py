from __future__ import annotations

import base64
import hashlib
import secrets
from urllib.parse import urlencode

import httpx
from fastapi import Cookie, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse

from config import settings
from qf_client import qf_client

app = FastAPI(title="Project Lantern API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _is_secure_cookie() -> bool:
    return settings.frontend_url.startswith("https://")


def _pkce_code_verifier() -> str:
    return secrets.token_urlsafe(64)


def _random_value() -> str:
    return secrets.token_urlsafe(32)


def _pkce_code_challenge(verifier: str) -> str:
    digest = hashlib.sha256(verifier.encode("utf-8")).digest()
    return base64.urlsafe_b64encode(digest).decode("utf-8").rstrip("=")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "project-lantern-api"}


@app.get("/api/qf/oauth/start")
def qf_oauth_start():
    state = _random_value()
    nonce = _random_value()
    code_verifier = _pkce_code_verifier()
    code_challenge = _pkce_code_challenge(code_verifier)

    params = {
        "response_type": "code",
        "client_id": settings.qf_client_id,
        "redirect_uri": settings.qf_oauth_redirect_uri,
        "scope": settings.qf_user_scopes,
        "state": state,
        "nonce": nonce,
        "code_challenge": code_challenge,
        "code_challenge_method": "S256",
    }
    auth_url = f"{settings.qf_auth_base_url}/oauth2/auth?{urlencode(params)}"
    response = RedirectResponse(url=auth_url, status_code=307)

    cookie_base = {
        "httponly": True,
        "secure": _is_secure_cookie(),
        "samesite": "lax",
        "max_age": 600,
    }
    response.set_cookie("qf_oauth_state", state, **cookie_base)
    response.set_cookie("qf_oauth_nonce", nonce, **cookie_base)
    response.set_cookie("qf_oauth_code_verifier", code_verifier, **cookie_base)
    return response


@app.get("/api/qf/oauth/callback")
async def qf_oauth_callback(
    code: str | None = None,
    state: str | None = None,
    qf_oauth_state: str | None = Cookie(default=None),
    qf_oauth_code_verifier: str | None = Cookie(default=None),
):
    fail_url = f"{settings.frontend_url}/qf-connect?error=oauth_failed"
    if not code or not state or not qf_oauth_state or state != qf_oauth_state:
        return RedirectResponse(url=fail_url, status_code=307)

    if not qf_oauth_code_verifier:
        return RedirectResponse(url=fail_url, status_code=307)

    token_url = f"{settings.qf_auth_base_url}/oauth2/token"
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                token_url,
                auth=(settings.qf_client_id.strip(), settings.qf_client_secret.strip()),
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": settings.qf_oauth_redirect_uri,
                    "code_verifier": qf_oauth_code_verifier,
                },
            )
            response.raise_for_status()
            token_data = response.json()
    except Exception:
        return RedirectResponse(url=fail_url, status_code=307)

    access_token = token_data.get("access_token")
    if not access_token:
        return RedirectResponse(url=fail_url, status_code=307)

    success_url = f"{settings.frontend_url}/qf-connect?connected=1"
    redirect = RedirectResponse(url=success_url, status_code=307)
    cookie_base = {
        "httponly": True,
        "secure": _is_secure_cookie(),
        "samesite": "lax",
        "max_age": 60 * 60 * 24,
    }
    redirect.set_cookie("qf_user_access_token", access_token, **cookie_base)

    refresh_token = token_data.get("refresh_token")
    if refresh_token:
        redirect.set_cookie("qf_user_refresh_token", refresh_token, **cookie_base)

    redirect.delete_cookie("qf_oauth_state")
    redirect.delete_cookie("qf_oauth_nonce")
    redirect.delete_cookie("qf_oauth_code_verifier")
    return redirect


@app.get("/api/qf/user/status")
def qf_user_status(qf_user_access_token: str | None = Cookie(default=None)):
    return {"connected": bool(qf_user_access_token)}


@app.get("/api/qf/user/bookmarks")
async def qf_user_bookmarks(
    mushafId: int = Query(default=1, ge=1),
    first: int | None = Query(default=None, ge=1),
    last: int | None = Query(default=None, ge=1),
    qf_user_access_token: str | None = Cookie(default=None),
):
    if not qf_user_access_token:
        return JSONResponse(
            status_code=401,
            content={
                "connected": False,
                "message": "Connect your Quran.Foundation account first.",
            },
        )

    request_params: dict[str, int] = {"mushafId": mushafId}
    if first is not None:
        request_params["first"] = first
    elif last is not None:
        request_params["last"] = last
    else:
        request_params["first"] = 10

    url = "https://apis.quran.foundation/auth/v1/bookmarks"
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                params=request_params,
                headers={
                    "x-auth-token": qf_user_access_token,
                    "x-client-id": settings.qf_client_id.strip(),
                    "Accept": "application/json",
                },
            )
        if response.status_code >= 400:
            message = "Quran.Foundation User API request failed"
            try:
                payload = response.json()
                if isinstance(payload, dict):
                    message = str(payload.get("message") or payload.get("error") or message)
            except ValueError:
                pass
            return JSONResponse(
                status_code=response.status_code,
                content={"connected": True, "status": response.status_code, "message": message},
            )

        return {
            "connected": True,
            "source": "qf-user-api",
            "feature": "bookmarks",
            "data": response.json(),
        }
    except httpx.RequestError:
        return JSONResponse(
            status_code=502,
            content={
                "connected": True,
                "status": 502,
                "message": "Unable to reach Quran.Foundation User API.",
            },
        )


@app.get("/api/qf/chapters")
async def get_quran_chapters():
    try:
        data = await qf_client.get_chapters()
        return data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/debug/qf-config")
def debug_qf_config():
    return {
        "qf_env": settings.qf_env,
        "qf_auth_base_url": settings.qf_auth_base_url,
        "qf_api_base_url": settings.qf_api_base_url,
        "client_id_prefix": settings.qf_client_id[:8] if settings.qf_client_id else None,
        "client_secret_length": len(settings.qf_client_secret) if settings.qf_client_secret else 0,
    }


@app.get("/api/qf/search")
async def search_quran(q: str = Query(..., min_length=2)):
    query = q.strip()
    if len(query) < 2:
        raise HTTPException(status_code=400, detail="Search query is required.")

    try:
        data = await qf_client.search_ayahs(query)
        return data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/api/qf/verse/{verse_key}")
async def get_quran_verse(verse_key: str):
    try:
        data = await qf_client.get_verse_by_key(verse_key)
        return data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/api/qf/translation/{translation_id}/{verse_key}")
async def get_quran_translation(translation_id: int, verse_key: str):
    try:
        data = await qf_client.get_translation_by_verse_key(translation_id, verse_key)
        return data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/api/qf/translation-resources")
async def get_quran_translation_resources():
    try:
        data = await qf_client.get_translation_resources()
        return data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
