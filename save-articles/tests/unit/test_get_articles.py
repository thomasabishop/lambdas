import sys, os, pytest, logging  # type: ignore
from unittest.mock import patch, Mock
from requests.exceptions import RequestException

parentdir = "/home/thomas/repos/lambdas/save-articles/save_articles"
sys.path.insert(0, parentdir)


# import the get_articles function from the helpers module
from helpers import get_articles


def test_no_endpoint(caplog):
    os.environ.pop("POCKET_LAMBDA_ENDPOINT", None)  # Remove env variable if it exists

    with caplog.at_level(logging.ERROR):
        result = get_articles("some_type")

    assert (
        "Error: POCKET_LAMBDA_ENDPOINT envinronment variable is not set" in caplog.text
    )
    assert result is None
