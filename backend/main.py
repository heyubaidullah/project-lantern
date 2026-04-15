from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from qf_client import qf_client

from config import settings

app = FastAPI(title="Project Lantern API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "project-lantern-api"}


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