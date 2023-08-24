import os
import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials


def lambda_handler(event, context):
    print(f"GOOGLE_CREDS: {os.environ['GOOGLE_CREDS']}")
    # Load credentials from env var
    creds_json = json.loads(os.environ["GOOGLE_CREDS"])
    creds_json["private_key"] = creds_json["private_key"].replace("\\n", "\n")

    # Use creds to create a client to interact with the Google Drive and Google Sheets API
    scope = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]

    creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_json, scope)
    client = gspread.authorize(creds)

    # Open the sheet and update
    sheet = client.open("lambda test sheet").sheet1

    # Sample update: For the sake of simplicity, let's update A1 cell
    sheet.update_cell(1, 1, "Updated from Lambda locally!")

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Google Sheet updated locally!"}),
    }
