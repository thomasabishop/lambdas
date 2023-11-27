import sys, os, logging, json
from pytest import raises
from unittest.mock import patch, Mock
from oauth2client.service_account import ServiceAccountCredentials  # type: ignore


parentdir = "/home/thomas/repos/lambdas/python/save-articles/src"
sys.path.insert(0, parentdir)

from lib import get_google_credentials


def test_get_google_credentials_failure_missing_env_var():
    """
    Should log an error and raise ValueException if POCKET_LAMBDA_ENDPOINT is not set
    """

    os.environ.pop("GOOGLE_CREDS", None)  # Remove env variable if it exists

    with raises(ValueError) as excinfo:  # Watch for the ValueError
        get_google_credentials()

    assert "Error: GOOGLE_CREDS environment variable is not set" in str(excinfo.value)


def test_get_google_credentials_failure_invalid_json(caplog):
    """
    Should log an error and raise ValueError if GOOGLE_CREDS is not valid JSON
    """

    os.environ["GOOGLE_CREDS"] = "invalid json"

    with raises(Exception):
        get_google_credentials()

    assert (
        "Error: GOOGLE_CREDS environment variable exists but required Google credentials could not be sourced"
        in caplog.text
    )
