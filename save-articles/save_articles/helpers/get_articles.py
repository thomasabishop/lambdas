import requests
import os
import logging
from requests.exceptions import RequestException, HTTPError, Timeout, ConnectionError
from typing import Dict, Any, Optional


def main(article_type: str) -> Optional[Dict[str, Any]]:
    """Retrieve articles from Pocket API"""

    POCKET_LAMBDA_ENDPOINT = os.environ.get("POCKET_LAMBDA_ENDPOINT")

    if POCKET_LAMBDA_ENDPOINT is None:
        raise ValueError(
            "Error: POCKET_LAMBDA_ENDPOINT environment variable is not set"
        )

    try:
        # Interpolate the article_type into the Pocket request URL
        endpoint = POCKET_LAMBDA_ENDPOINT.format(article_type=article_type)
        response = requests.get(endpoint)
        response.raise_for_status()
        return response.json()

    except HTTPError as http_err:
        logging.error(f"HTTP Error occurred: {http_err}")

    except ConnectionError as conn_err:
        logging.error(f"Connection Error occurred: {conn_err}")

    except Timeout as timeout_err:
        logging.error(f"Timeout Error occurred: {timeout_err}")

    except RequestException as e:
        logging.error(f"Request Exception occurred: {e}")

    return None
