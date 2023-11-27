import logging
from typing import Any, Dict, List, TypedDict
from lib import utils


class ArticleInfo(TypedDict):
    timestamp: str
    article_title: str
    link: str


def extract_articles(pocket_data: Dict[str, Any]) -> Dict[str, Dict]:
    """Extract the dictionary of articles from the Pocket API response"""
    try:
        # If no data passed in:

        if not pocket_data:
            raise ValueError("Data returned from Pocket API is empty")
        return pocket_data.get("data", {}).get("list", {})
    except Exception as e:
        logging.warning(f"An error occurred: {e}")
        return {}


def transform_articles(articles: List[List]) -> List[List]:
    """
    Sort articles by reverse chronology and convert Unix timestamp to human-readable date
    """
    # Reverse sort by date added:
    sorted_articles = utils.sort_multidimensional_list(articles)

    # Convert Unix timestamp to human-readable date:
    date_converted_articles = [
        [utils.convert_unix_timestamp(i[0])] + i[1:] for i in sorted_articles
    ]
    return date_converted_articles


def parse_articles(articles: Dict[str, Any], current_worksheet) -> List[List]:
    """Extract article properties to multidimenisonal list"""

    # Extract article properties as multidimensional list:
    if not articles:
        raise ValueError("No articles to parse")

    articles_list = []

    for article in articles.values():
        try:
            time_added, given_title, resolved_url = (
                article["time_added"],
                article["given_title"],
                article["resolved_url"],
            )
        except KeyError as e:
            logging.warning(
                f"Article in '{current_worksheet}' missing {e} property. Skipping article."
            )
            continue

        articles_list.append([time_added, given_title, resolved_url])

    return articles_list


def main(pocket_data: Dict[str, Any], current_worksheet: str) -> List[List]:
    """Orchestrate the overall processing of articles"""
    try:
        articles = extract_articles(pocket_data)
        parsed_articles = parse_articles(articles, current_worksheet)
        transformed_articles = transform_articles(parsed_articles)
        return transformed_articles
    except Exception as e:
        logging.warning(f"An error occurred: {e}")
        return None
