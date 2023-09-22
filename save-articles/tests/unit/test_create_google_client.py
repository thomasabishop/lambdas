import sys, os, logging, json
from pytest import raises

parentdir = "/home/thomas/repos/lambdas/save-articles/save_articles"
sys.path.insert(0, parentdir)

from helpers import get_credentials


def test_get_credentials():
    """
    It should log an error and raise ValueException if POCKET_LAMBDA_ENDPOINT is not set
    """

    os.environ.pop("GOOGLE_CREDS", None)  # Remove env variable if it exists

    with raises(ValueError) as excinfo:  # Watch for the ValueError
        get_credentials()

    assert "Error: GOOGLE_CREDS environment variable is not set" in str(excinfo.value)
