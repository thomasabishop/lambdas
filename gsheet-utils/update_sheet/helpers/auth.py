"""
Authenticate access to Google services
"""
import os
import json
import gspread
import boto3
from oauth2client.service_account import ServiceAccountCredentials


def get_secret():
    python_env = os.environ.get("PYTHON_ENV", "local")
    """In production, source creds from SecretsManager"""
    if python_env == "production":
        secrets_manager = boto3.client("secretsmanager")
        response = secrets_manager.get_secret_value(SecretId=os.environ["SECRET_ARN"])
        secret_values = json.loads(response["SecretString"])
        return secret_values["GOOGLE_CREDS"]
    else:
        """If local, source creds from env var"""
        return json.loads(os.environ["GOOGLE_CREDS"])


def get_credentials():
    """Google services we want to access"""
    scope = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]

    creds_json = get_secret()
    creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_json, scope)

    return creds


def create_client():
    creds = get_credentials()
    client = gspread.authorize(creds)
    return client
