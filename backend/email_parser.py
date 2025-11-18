
import re

def parse_email(text):
    addresses = re.findall(r"[A-ZÅÄÖa-zåäö]+ \d+, \d+ [A-ZÅÄÖa-zåäö]+", text)
    return addresses

import imaplib
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_USER = os.getenv("EMAIL_ADDRESS")


def fetch_status_updates():
    """
    Attempts to read inbox and extract status updates.
    If email login fails, return {} and do NOT break dashboard.
    """

    try:
        # OAuth IMAP login will be added here later when admin approves
        raise Exception("IMAP not enabled yet")  # TEMPORARY BLOCKER

    except Exception as e:
        print("IMAP connection error:", e)
        return {}  # no updates → dashboard still loads all providers
