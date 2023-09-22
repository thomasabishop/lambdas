import os, json, logging
from oauth2client.service_account import ServiceAccountCredentials  # type: ignore


def get_credentials():
    """Return credentials for Google Sheets API"""

    # Specify Google services I want to access
    scope = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]

    GOOGLE_CREDS = os.environ.get("GOOGLE_CREDS")

    if GOOGLE_CREDS is None:
        raise ValueError("Error: GOOGLE_CREDS environment variable is not set")

    try:
        creds_json = json.loads(os.environ["GOOGLE_CREDS"])
        creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_json, scope)
        return creds

    except Exception as e:
        logging.error(
            f"Error: GOOGLE_CREDS environment variable exists but required Google credentials could not be sourced: {e}"
        )
        return None
