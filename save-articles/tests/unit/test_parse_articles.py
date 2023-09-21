import sys, json, logging
from pathlib import Path
from unittest.mock import patch

parentdir = "/home/thomas/repos/lambdas/save-articles/save_articles"
sys.path.insert(0, parentdir)

# Import the parse_articles function from the helpers module
from helpers import parse_articles, extract_articles


# Import mock Pocket API response from file
fixture = Path(
    "/home/thomas/repos/lambdas/save-articles/tests/fixtures/pocket_api_response.json"
)

with open(fixture) as f:
    pocket_response = json.load(f)


"""
Test extract_articles function: 
"""


def test_extract_articles_success():
    """
    It should extract the dictionary of articles from the Pocket API response
    """
    result = extract_articles(pocket_response)
    assert len(result) == 2


def test_extract_articles_empty(caplog):
    """
    It should return an empty dictionary if no data passed in
    """
    result = extract_articles({})
    assert result == {}
    assert "Data returned from Pocket API is empty" in caplog.text
    assert "An error occurred" in caplog.text


def test_extract_articles_None(caplog):
    """
    It should return an empty dictionary if None is passed to the function
    """
    result = extract_articles(None)
    assert result == {}
    assert "Data returned from Pocket API is empty" in caplog.text
    assert "An error occurred" in caplog.text


"""
Test parse_articles function: 
"""


def test_parse_articles_success():
    """
    It should parse articles returned from Pocket API and return a list contaning key properties for each article
    """
    result = parse_articles(pocket_response)
    assert result == [
        {
            "timestamp": "1688582410",
            "article_title": "Do we live in a society without a counterculture?",
            "link": "https://www.xmodtwo.com/p/do-we-live-in-a-society-without-a",
        },
        {
            "timestamp": "1688582413",
            "article_title": "The age of average",
            "link": "https://www.alexmurrell.co.uk/articles/the-age-of-average",
        },
    ]


def test_parse_articles_error(caplog):
    with patch("helpers.extract_articles", return_value={}):
        result = parse_articles({})
    assert result == []
    assert "No articles to parse" in caplog.text
    assert "An error occurred" in caplog.text
