from email_parser import fetch_status_updates
import threading
import time
from app import INCIDENTS

REFRESH_INTERVAL = 120  # seconds

def scheduler_loop():
    while True:
        try:
            updates = fetch_status_updates()

            if updates:  # Only update if parsing was successful
                for provider, data in updates.items():
                    INCIDENTS[provider]["status"] = data.get("status", "Unknown")
                    INCIDENTS[provider]["message"] = data.get("message", "")
        except Exception as e:
            print("Scheduler error:", e)

        time.sleep(REFRESH_INTERVAL)


def start_scheduler():
    t = threading.Thread(target=scheduler_loop, daemon=True)
    t.start()
