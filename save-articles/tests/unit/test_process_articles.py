import sys, json, logging, copy
import pytest  # type: ignore
from pathlib import Path
from unittest.mock import patch

parentdir = "/home/thomas/repos/lambdas/save-articles/save_articles"
sys.path.insert(0, parentdir)

# Import the parse_articles function from the helpers module
from helpers import (
    parse_articles,
    extract_articles,
    transform_articles,
    process_articles,
)


mock_pocket_api_response = {
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


def test_extract_articles_success():
    """It should extract the dictionary of articles from the Pocket API response"""
    result = extract_articles(mock_pocket_api_response)
    assert len(result) == 2


def test_extract_articles_failure(caplog):
    """
    It should return an empty dictionary if no data passed in/ data is None
    (Reliant on falsy value of `{}`)
    """
    result = extract_articles({})
    assert result == {}
    assert "An error occurred: Data returned from Pocket API is empty" in caplog.text


def test_transform_articles_success():
    input_articles = [
        ["1688582410", "Article One", "https://www.article1.com"],
        ["1694457911", "Article Two", "https://www.article2.com"],
    ]

    expected = [
        ["11-09-2023", "Article Two", "https://www.article2.com"],
        ["05-07-2023", "Article One", "https://www.article1.com"],
    ]

    result = transform_articles(input_articles)

    assert result == expected


def test_parse_articles_success():
    """
    It should parse articles returned from Pocket API and return a multidimensional list
    where each element is a list of extracted properties.
    """
    mock_article_list = mock_pocket_api_response["data"]["list"]
    result = parse_articles(mock_article_list)
    assert result == [
        [
            "1694457911",
            "Article One",
            "https://www.article1.com",
        ],
        [
            "1688582410",
            "Article Two",
            "https://www.article2.com",
        ],
    ]


def test_parse_articles_failure_empty():
    """If no articles to parse, it should return an empty list"""
    with pytest.raises(ValueError, match="No articles to parse"):
        parse_articles({})


def test_parse_articles_failure_missing_properties(caplog):
    """If article is missing a property, it should log a warning and skip the article"""
    mock_pocket_api_response_copy = copy.deepcopy(mock_pocket_api_response)

    mock_pocket_api_response_copy["data"]["list"]["333"] = {
        "item_id": "333",
        "resolved_id": "333",
        "given_title": "Article Three",
        "resolved_url": "https://www.alexmurrell.co.uk/articles/the-age-of-average",
    }

    mock_article_list = mock_pocket_api_response_copy["data"]["list"]
    result = parse_articles(mock_article_list)

    assert "Article missing 'time_added' property. Skipping article." in caplog.text
    assert len(result) == 2  # should not be 3 because of missing property


def test_main_success():
    result = process_articles(mock_pocket_api_response)
    print(result)
    assert result == [
        ["11-09-2023", "Article One", "https://www.article1.com"],
        ["05-07-2023", "Article Two", "https://www.article2.com"],
    ]
