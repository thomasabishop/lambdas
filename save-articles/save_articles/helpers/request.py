import requests
from requests.exceptions import RequestException


def get_articles(article_type):
    """Retrieve articles from Pocket API"""
    POCKET_LAMBDA_ENDPOINT = f"https://r9ww4g9y2c.execute-api.eu-west-2.amazonaws.com/Prod/query-pocket/get-articles-by-tag?tag={article_type}"

    try:
        response = requests.get(POCKET_LAMBDA_ENDPOINT)

        # Check if the request was successful
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: Failed to fetch data. Status code: {response.status_code}")
            return None

    except RequestException as e:
        print(f"An error occurred: {e}")
        return None


def post_articles(article_list, target_worksheet):
    """Save articles to Google Sheet"""
    GSHEETS_LAMBDA_ENDPOINT = (
        "https://klmp8lwc2j.execute-api.eu-west-2.amazonaws.com/Prod/update_sheet"
    )

    body = {"worksheet": target_worksheet, "data": article_list}

    try:
        response = requests.post(GSHEETS_LAMBDA_ENDPOINT, json=body)
        if response.status_code == 200:
            print("Success: Data successfully sent.")
        else:
            print("Error: Failed to send data.")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
