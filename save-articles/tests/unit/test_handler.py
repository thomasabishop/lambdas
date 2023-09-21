"""
Tests should be run from the root of the project, e.g.: lambdas/save-articles
Test command: pytest --cache-clear
"""

# Below is necessary for imports within app.hanlder to resolve correctly:
import sys

parentdir = "/home/thomas/repos/lambdas/save-articles/save_articles"
sys.path.insert(0, parentdir)


import json
import pytest  # type: ignore
from unittest.mock import patch

from app import handler  # type: ignore


@pytest.fixture()
def apigw_event():
    """Generates API Gateway Event"""

    return {
        "body": '{ "test": "body"}',
        "resource": "/{proxy+}",
        "requestContext": {
            "resourceId": "123456",
            "apiId": "1234567890",
            "resourcePath": "/{proxy+}",
            "httpMethod": "POST",
            "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
            "accountId": "123456789012",
            "identity": {
                "apiKey": "",
                "userArn": "",
                "cognitoAuthenticationType": "",
                "caller": "",
                "userAgent": "Custom User Agent String",
                "user": "",
                "cognitoIdentityPoolId": "",
                "cognitoIdentityId": "",
                "cognitoAuthenticationProvider": "",
                "sourceIp": "127.0.0.1",
                "accountId": "",
            },
            "stage": "prod",
        },
        "queryStringParameters": {"foo": "bar"},
        "headers": {
            "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
            "Accept-Language": "en-US,en;q=0.8",
            "CloudFront-Is-Desktop-Viewer": "true",
            "CloudFront-Is-SmartTV-Viewer": "false",
            "CloudFront-Is-Mobile-Viewer": "false",
            "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
            "CloudFront-Viewer-Country": "US",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Upgrade-Insecure-Requests": "1",
            "X-Forwarded-Port": "443",
            "Host": "1234567890.execute-api.us-east-1.amazonaws.com",
            "X-Forwarded-Proto": "https",
            "X-Amz-Cf-Id": "aaaaaaaaaae3VYQb9jd-nvCd-de396Uhbp027Y2JvkCPNLmGJHqlaA==",
            "CloudFront-Is-Tablet-Viewer": "false",
            "Cache-Control": "max-age=0",
            "User-Agent": "Custom User Agent String",
            "CloudFront-Forwarded-Proto": "https",
            "Accept-Encoding": "gzip, deflate, sdch",
        },
        "pathParameters": {"proxy": "/examplepath"},
        "httpMethod": "POST",
        "stageVariables": {"baz": "qux"},
        "path": "/examplepath",
    }


def test_lambda_handler(apigw_event):
    with patch("app.get_articles") as mock_get_articles, patch(
        "app.parse_articles"
    ) as mock_parse_articles, patch("app.post_articles") as mock_post_articles:
        # Mock the return value from get_articles
        mock_get_articles.return_value = {"data": {"list": "dummy_data"}}

        # Mock the return value from parse_articles
        mock_parse_articles.return_value = "parsed_dummy_data"

        # Mock the return value from post_articles
        mock_post_articles.return_value = True

        fake_context = ""

        ret = handler(apigw_event, fake_context)

        assert isinstance(ret, dict)
        assert "statusCode" in ret
        assert ret["statusCode"] == 200
        assert ret["body"] == "Articles successfully saved"
