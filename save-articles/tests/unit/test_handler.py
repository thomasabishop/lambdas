"""
Tests should be run from the root of the project, e.g.: lambdas/save-articles
Test command: pytest --cache-clear
"""

# Below is necessary for imports within app.hanlder to resolve correctly:
import sys

parentdir = "/home/thomas/repos/lambdas/save-articles/save_articles"
sys.path.insert(0, parentdir)


import pytest  # type: ignore
from unittest.mock import patch
from requests.exceptions import RequestException
from app import handler  # type: ignore

mock_get_articles_response = {
    "data": {
        "status": 1,
        "complete": 1,
        "list": {
            "111": {
                "item_id": "3797621824",
                "resolved_id": "3797621824",
                "given_title": "Article One",
                "time_added": "1694457911",
                "resolved_url": "https://www.article1.com",
            },
            "222": {
                "item_id": "3829196293",
                "resolved_id": "3829196293",
                "given_title": "Article Two",
                "time_added": "1688582410",
                "resolved_url": "https://www.article2.com",
            },
        },
    }
}

mock_process_articles_response = [
    ["11-09-2023", "Article One", "https://www.article1.com"],
    ["05-07-2023", "Article Two", "https://www.article2.com"],
]


@pytest.fixture(scope="function")
def setup_function():
    with patch("app.get_articles") as mock_get_articles, patch(
        "app.process_articles"
    ) as mock_process_articles, patch("app.update_worksheet") as mock_update_worksheet:
        yield mock_get_articles, mock_process_articles, mock_update_worksheet


def test_handler_success(setup_function):
    mock_get_articles, mock_process_articles, mock_update_worksheet = setup_function

    # Mock successful return values:
    mock_get_articles.return_value = mock_get_articles_response
    mock_process_articles.return_value = mock_process_articles_response

    response = handler({}, "")

    # Check API Gateway response:
    assert response["statusCode"] == 200
    assert response["body"]["message"] == "All worksheets updated successfully"
    assert len(response["body"]["updated_worksheets"]) == 3

    # Check functions were called for each worksheet:
    assert mock_get_articles.call_count == 3
    assert mock_process_articles.call_count == 3
    assert mock_update_worksheet.call_count == 3

    # Check that process_articles was called with correct arguments:
    mock_process_articles.assert_any_call(mock_get_articles_response)
    mock_process_articles.assert_any_call(mock_get_articles())  # for demo purposes

    # Check that update_worksheet was called with correct arguments:
    mock_update_worksheet.assert_any_call(
        "general_articles", mock_process_articles_response
    )

    # Check (as sample) that the second round of updates corresponds to the technical worksheet:
    second_get_articles_call = mock_get_articles.call_args_list[1]
    second_update_worksheet_call = mock_update_worksheet.call_args_list[1]
    assert second_get_articles_call[0][0] == "technical"


def test_handler_complete_failure(setup_function):
    mock_get_articles, mock_process_articles, mock_update_worksheet = setup_function
    mock_get_articles.side_effect = Exception("Some error")
    response = handler({}, "")
    assert response["body"]["message"] == "Not all worksheets could be updated"
    assert len(response["body"]["failed_updates"]) == 3


def test_handler_partial_failure(setup_function):
    mock_get_articles, mock_process_articles, mock_update_worksheet = setup_function

    # get_articles will fail on the second call:
    mock_get_articles.side_effect = [
        mock_get_articles_response,
        Exception("Some error"),
        mock_get_articles_response,
    ]
    response = handler({}, "")

    assert response["body"]["message"] == "Not all worksheets could be updated"

    # Resulting in one failed update:
    assert len(response["body"]["failed_updates"]) == 1

    # And two successful updates
    assert len(response["body"]["updated_worksheets"]) == 2
