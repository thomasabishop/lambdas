from helpers import get_articles, post_articles, parse_articles


def handler(event, context):
    worksheets = [
        # {"pocket_endpoint": "general", "name": "general_articles"},
        # {"pocket_endpoint": "technical", "name": "technical_articles"},
        {"pocket_endpoint": "gaby", "name": "gaby_articles"},
    ]

    try:
        for worksheet in worksheets:
            pocket_data = get_articles(worksheet["pocket_endpoint"])
            articles = pocket_data["data"]["list"]  # returns a dictionary
            parsed = parse_articles(articles)
            post_articles(parsed, worksheet["name"])
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
