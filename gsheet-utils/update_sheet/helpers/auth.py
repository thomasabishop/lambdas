"""
Authenticate access to Google services
"""

from oauth2client.service_account import ServiceAccountCredentials

from . import env


def get_credentials():
    scope = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]

    creds_json = env.get_var("GOOGLE_CREDS")

    creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_json, scope)

    return creds
