from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Load providers from .env
providers_raw = os.getenv("PROVIDERS", "")
all_providers = [p.strip() for p in providers_raw.split(",") if p.strip()]

# Global storage: provider → {status, message}
INCIDENTS = {p: {"status": "Unknown", "message": ""} for p in all_providers}

# Mount static + templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})


@app.get("/incidents")
async def get_incidents():
    """
    Always return all providers, even if email login fails.
    """
    return JSONResponse({
        "incidents": [
            [provider,
             INCIDENTS[provider]["status"],
             INCIDENTS[provider]["message"]]
            for provider in all_providers
        ]
    })
