"""
Authenticate access to Google services
"""
import os
import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials


def get_credentials():
    """Google services we want to access"""
    scope = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]

    # creds_json = get_secret()
    creds_json = json.loads(os.environ["GOOGLE_CREDS"])
    creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_json, scope)

    return creds


def create_client():
    creds = get_credentials()
    client = gspread.authorize(creds)
    return client
