def articles(articles_dict):
    """
    Parse articles returned from Pocket API and extract
    properties I wish to save
    """
    result = []
    for value in articles_dict.values():
        timestamp = value.get("time_added", "undefined")
        date_added = value.get("time_added", "undefined")
        article_title = value.get("given_title", "undefined")
        link = value.get("resolved_url", "undefined")

        result.append(
            {
                "timestamp": timestamp,
                "date_added": date_added,
                "article_title": article_title,
                link: link,
            }
        )

    return result
