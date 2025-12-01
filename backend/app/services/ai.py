import requests
from ..core.config import get_settings

settings = get_settings()


def generate_daily_summary(data: dict) -> dict:
    if not settings.enable_ollama:
        return {"summary": "Ollama disabled"}
    prompt = "Generate a concise coaching summary for the provided health metrics." + str(data)
    resp = requests.post(f"{settings.ollama_host}/api/generate", json={"model": settings.ai_model, "prompt": prompt}, timeout=30)
    if resp.ok:
        return {"summary": resp.json().get("response")}
    return {"summary": "Unable to contact Ollama"}
