from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import sqlite3
import os
import imaplib
import email
import time
from threading import Thread
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
IMAP_SERVER = os.getenv("IMAP_SERVER")
IMAP_PORT = int(os.getenv("IMAP_PORT", 993))
REFRESH_INTERVAL = int(os.getenv("REFRESH_INTERVAL", 120))

# Detect providers dynamically
def detect_providers():
    providers = []
    index = 1
    while True:
        name_key = f"PROVIDER_{index}_NAME"
        email_key = f"PROVIDER_{index}_EMAIL"
        provider_name = os.getenv(name_key)
        provider_email = os.getenv(email_key)
        if provider_name and provider_email:
            providers.append((provider_name, provider_email))
        else:
            break
        index += 1
    return providers

PROVIDERS = detect_providers()

# FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Database
def init_db():
    conn = sqlite3.connect("incidents.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS incidents (
            provider TEXT PRIMARY KEY,
            status TEXT,
            subject TEXT
        )
    """)
    for provider_name, _ in PROVIDERS:
        cursor.execute("""
            INSERT OR IGNORE INTO incidents (provider, status, subject)
            VALUES (?, ?, ?)
        """, (provider_name, "Unknown", ""))
    conn.commit()
    conn.close()
init_db()

# Email and DB update
def fetch_latest_email(mail, provider_name, provider_email):
    try:
        mail.select("inbox")
        status, data = mail.search(None, f'(FROM "{provider_email}")')
        email_ids = data[0].split()
        if not email_ids:
            update_db(provider_name, "Up", "No incidents")
            return
        latest_email_id = email_ids[-1]
        status, data = mail.fetch(latest_email_id, "(RFC822)")
        raw_email = data[0][1]
        msg = email.message_from_bytes(raw_email)
        update_db(provider_name, "Down", msg.get("Subject", "No subject"))
    except Exception as e:
        update_db(provider_name, "Error", str(e))

def update_db(provider_name, status, subject):
    conn = sqlite3.connect("incidents.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO incidents (provider, status, subject)
        VALUES (?, ?, ?)
        ON CONFLICT(provider) DO UPDATE SET
            status=excluded.status,
            subject=excluded.subject
    """, (provider_name, status, subject))
    conn.commit()
    conn.close()

def background_worker():
    while True:
        try:
            mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
            mail.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            for provider_name, provider_email in PROVIDERS:
                fetch_latest_email(mail, provider_name, provider_email)
            mail.logout()
        except Exception as e:
            print("IMAP connection error:", e)
        time.sleep(REFRESH_INTERVAL)

Thread(target=background_worker, daemon=True).start()

# API endpoints
@app.get("/status")
def get_status():
    conn = sqlite3.connect("incidents.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM incidents")
    rows = cursor.fetchall()
    conn.close()
    return {"incidents": rows}

@app.get("/config")
def get_config():
    return {"refresh_interval": REFRESH_INTERVAL}

@app.get("/healthz")
def health_check():
    return {"status": "ok"}

@app.get("/", response_class=HTMLResponse)
def dashboard(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

