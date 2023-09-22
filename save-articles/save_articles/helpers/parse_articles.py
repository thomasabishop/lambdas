import logging
from typing import Any, Dict, List, TypedDict


class ArticleInfo(TypedDict):
    timestamp: str
    article_title: str
    link: str


def extract_articles(pocket_data: Dict[str, Any]) -> Dict[str, Dict]:
    """
    Extract the dictionary of articles from the Pocket API response
    """
    try:
        # If no data passed in:
        if not pocket_data:
            raise ValueError("Data returned from Pocket API is empty")
        return pocket_data.get("data", {}).get("list", {})
    except Exception as e:
        logging.warning(f"An error occurred: {e}")
        return {}


def parse_articles(pocket_data: Dict[str, Any]) -> List[ArticleInfo]:
    """
    Parse articles returned from Pocket API and extract
    properties I wish to save
    """
    try:
        articles_dict = extract_articles(pocket_data)
        # If articles dictionary is empty:
        if not articles_dict:
            raise ValueError("No articles to parse")

        parsed = []
        for article in articles_dict.values():
            parsed.append(
                {
                    "timestamp": article.get("time_added", "undefined"),
                    "article_title": article.get("given_title", "undefined"),
                    "link": article.get("resolved_url", "undefined"),
                }
            )
        return parsed
    except Exception as e:
        logging.warning(f"An error occurred: {e}")
        return []
