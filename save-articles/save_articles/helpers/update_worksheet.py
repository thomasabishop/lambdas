import os, json, logging
import gspread
from typing import Optional, List
from gspread.exceptions import SpreadsheetNotFound, APIError
from oauth2client.service_account import ServiceAccountCredentials  # type: ignore


def get_google_credentials():
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
        print("goes wrong")
        logging.error(
            f"Error: GOOGLE_CREDS environment variable exists but required Google credentials could not be sourced: {e}"
        )
        # return None
        raise


def create_google_client() -> Optional[gspread.client.Client]:
    """
    Return a Google Sheets client that will enable me to interact with worksheets
    """

    creds = get_google_credentials()
    try:
        client = gspread.authorize(creds)
        return client

    except Exception as e:
        logging.error(f"Error: Google Sheets client could not be created: {e}")
        raise
        # return None


def main(worksheet_name: str, article_entries: List[List]) -> None:
    try:
        # Create client
        client = create_google_client()

        try:
            worksheet = client.open(worksheet_name).sheet1
            worksheet.clear()
            worksheet.append_rows(article_entries)
            logging.info(f"Worksheet {worksheet_name} updated successfully")
        except SpreadsheetNotFound as e:
            logging.error(f"Error: Spreadsheet not found: {e}")

        except APIError as e:
            logging.error(f"Network error: {e}")

    except Exception as e:
        logging.warning(f"An error occurred: {e}")
        raise
