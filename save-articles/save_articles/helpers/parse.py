# time_added, given_title, excerpt, resolved_url


def articles(articles_dict):
    result = []
    for value in articles_dict.values():
        date_added = value.get("time_added", "undefined")
        article_title = value.get("given_title", "undefined")
        article_excerpt = value.get("excerpt", "undefined")
        link = value.get("resolved_url", "undefined")

        result.append(
            {
                "date_added": date_added,
                "article_title": article_title,
                "article_excerpt": article_excerpt,
                link: link,
            }
        )

    return result
