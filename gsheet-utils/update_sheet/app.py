import json
from gspread.exceptions import SpreadsheetNotFound, APIError

from helpers import client
from helpers import edit_sheet


def lambda_handler(event, context):
    try:
        # Client for interacting with Google services:
        sheets_client = client.create()
        try:
            # Retrieve sheet:
            sheet = sheets_client.open("lambda test sheet").sheet1
        except SpreadsheetNotFound:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": f"Sheet {sheet} not found."}),
            }

        # Attempt data insertion:
        edit_sheet.insert_rows(sheet)
        return {
            "statusCode": 200,
            "body": json.dumps({"message": f"Sheet {sheet} updated successfully"}),
        }

    except APIError as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": f"Network error: {e} updated"}),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": f"An error occurred: {e}"}),
        }
