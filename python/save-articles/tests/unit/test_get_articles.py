import sys, os, logging, json
import pytest  # type: ignore
from pathlib import Path
from unittest.mock import patch, Mock
from requests.exceptions import RequestException, HTTPError, Timeout, ConnectionError

parentdir = "/home/thomas/repos/lambdas/python/save-articles/src"
sys.path.insert(0, parentdir)


# Import the get_articles function from the helpers module
from lib import get_articles


def test_failure_no_endpoint():
    """
    It should log an error and raise ValueException if POCKET_LAMBDA_ENDPOINT is not set
    """

    os.environ.pop("POCKET_LAMBDA_ENDPOINT", None)  # Remove env variable if it exists

    with pytest.raises(ValueError) as excinfo:  # Watch for the ValueError
        get_articles("some_type")

    assert "Error: POCKET_LAMBDA_ENDPOINT environment variable is not set" in str(
        excinfo.value
    )


# Test all possible Request exceptions through parameterization


# Before each, set endpoint env var:
@pytest.fixture(scope="function")
def setup_function():
    os.environ["POCKET_LAMBDA_ENDPOINT"] = "https://some_endpoint.com/{article_type}"
    yield
    del os.environ["POCKET_LAMBDA_ENDPOINT"]


# Set up paramaterization:
@pytest.mark.parametrize(
    "exception_type, log_message",
    [
        (RequestException, "Request Exception occurred: "),
        (HTTPError, "HTTP Error occurred: "),
        (Timeout, "Timeout Error occurred: "),
        (ConnectionError, "Connection Error occurred: "),
    ],
)
def test_failure_exceptions(caplog, setup_function, exception_type, log_message):
    with patch("requests.get", side_effect=exception_type("Some error")):
        result = get_articles("some_type")

    assert log_message in caplog.text
    assert result is None


def test_success():
    """
    If endpoint env var is set, it should make a successful request to the Pocket API,
    and return the response as a dictionary (parsed from JSON)
    """

    # Import mock Pocket API response from file
    fixture = Path(
        "/home/thomas/repos/lambdas/python/save-articles/tests/fixtures/pocket_api_response.json"
    )

    with open(fixture) as f:
        pocket_response = json.load(f)

    os.environ[
        "POCKET_LAMBDA_ENDPOINT"
    ] = "https://pocket-lambda-endpoint/{article_type}"
    endpoint = os.environ["POCKET_LAMBDA_ENDPOINT"].format(article_type="gaby")

    with patch("requests.get") as mock_get:
        mock_get.return_value = Mock(ok=True)
        mock_get.return_value.json.return_value = pocket_response

        result = get_articles("gaby")

    mock_get.assert_called_once_with(endpoint)
    assert result == pocket_response
