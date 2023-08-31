import json
from helpers import request
from helpers import parse


def lambda_handler(event, context):
    article_mappings = {
        "general": "general_articles",
        #  "technical": "technical_articles",
        #  "gaby": "gaby_articles",
    }
    parsed_articles = {}

    try:
        for article_type, worksheet in article_mappings.items():
            response = request.get_articles(article_type)

            if response:
                articles_dict = response.get("data", {}).get("list", {})
                parsed_articles[article_type] = parse.articles(articles_dict)
            else:
                print(f"Failed to get articles for category: {article_type}")

        for article_type, articles in parsed_articles.items():
            if articles:
                request.post_articles(articles, worksheet)
            else:
                print(f"No articles to post for category: {article_type}")

        return {
            "statusCode": 200,
            "body": "Articles successfully saved",
        }

    except Exception as e:
        print(f"An error occurred: {e}")
        return {
            "statusCode": 500,
            "body": "Internal Server Error",
        }
