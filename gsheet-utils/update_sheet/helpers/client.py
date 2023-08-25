"""
Create gspread client for interacting with GSheets
"""

import gspread

from . import auth


def create():
    creds = auth.get_credentials()
    client = gspread.authorize(creds)

    return client
