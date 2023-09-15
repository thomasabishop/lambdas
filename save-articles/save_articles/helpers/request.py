import requests
import os


def post_articles(article_list, target_worksheet):
    """Save articles to Google Sheet"""

    GSHEETS_LAMBDA_ENDPOINT = os.environ.get("GSHEETS_LAMBDA_ENDPOINT")

    body = {"worksheet": target_worksheet, "data": article_list}

    try:
        response = requests.post(GSHEETS_LAMBDA_ENDPOINT, json=body)
        if response.status_code == 200:
            print("Success: Data successfully sent.")
        else:
            print("Error: Failed to send data.")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
