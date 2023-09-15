import requests
import os
import logging
from requests.exceptions import RequestException
from typing import Dict, Any, Optional


POCKET_LAMBDA_ENDPOINT = os.environ.get("POCKET_LAMBDA_ENDPOINT")


def get_articles(article_type: str) -> Optional[Dict[str, Any]]:
    """Retrieve articles from Pocket API"""

    if POCKET_LAMBDA_ENDPOINT is None:
        logging.error("Error: POCKET_LAMBDA_ENDPOINT envinronment variable is not set")
        return None
    else:
        # Interpolate the article_type into the Pocket request URL
        endpoint = POCKET_LAMBDA_ENDPOINT.format(article_type=article_type)

    try:
        response = requests.get(endpoint)
        response.raise_for_status()
        return response.json()

    except RequestException as e:
        print(f"An error occurred: {e}")
        return None
