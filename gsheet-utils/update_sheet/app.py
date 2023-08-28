import json
from gspread.exceptions import SpreadsheetNotFound, APIError

from helpers import client
from helpers import update_articles


def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        sheet_title = body.get("sheet_title")
        sheet_data = body.get("sheet_data")

        # Create list of lists from sheet_data JSON
        entries = list(map(lambda d: list(d.values()), sheet_data))

        # Client for interacting with Google services:
        sheets_client = client.create()
        try:
            # Retrieve sheet:
            sheet = sheets_client.open(sheet_title).sheet1

        except SpreadsheetNotFound:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": f"Sheet {sheet} not found."}),
            }

        # Attempt data insertion:
        update_articles.add_entries_to_sheet(sheet, entries)

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
