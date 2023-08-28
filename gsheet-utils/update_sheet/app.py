import json
from gspread.exceptions import SpreadsheetNotFound, APIError

from helpers import auth
from helpers import update_articles


def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        worksheet = body.get("worksheet")
        data = body.get("data")

        # Create list of lists from sheet_data JSON
        entries = list(map(lambda d: list(d.values()), data))

        # Client for interacting with Google services:
        client = auth.create_client()
        try:
            # Retrieve worksheet:
            worksheet = client.open(worksheet).sheet1

        except SpreadsheetNotFound:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": f"Sheet {worksheet} not found."}),
            }

        # Attempt data insertion:
        update_articles.add_entries_to_sheet(worksheet, entries)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": f"Sheet {worksheet} updated successfully"}),
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
