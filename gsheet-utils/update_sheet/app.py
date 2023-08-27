import json
from gspread.exceptions import SpreadsheetNotFound, APIError

from helpers import client
from helpers import update_articles


dummy_data = [
    ["1689023491", "Article Three", "Lorem ipsum...", "https://example.com"],
    ["1688582410", "Article One", "Lorem ipsum...", "https://example.com"],
    ["1688647447", "Article Two", "Lorem ipsum...", "https://example.com"],
    ["1689023491", "Article Three", "Lorem ipsum...", "https://example.com"],
]


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
        update_articles.add_entries_to_sheet(sheet, dummy_data)

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
