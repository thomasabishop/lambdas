import logging
from helpers.process_articles import main as process_articles
from helpers.get_articles import main as get_articles
from helpers.update_worksheet import main as update_worksheet


def handler(event, context):
    worksheets = [
        {"pocket_endpoint": "general", "name": "general_articles"},
        {"pocket_endpoint": "technical", "name": "technical_articles"},
        {"pocket_endpoint": "gaby", "name": "gaby_articles"},
    ]

    updated = []
    failed_updates = []

    for worksheet in worksheets:
        try:
            pocket_data = get_articles(worksheet["pocket_endpoint"])
            processed_data = process_articles(pocket_data)
            update_worksheet(worksheet["name"], processed_data)
            updated.append(worksheet["name"])
        except Exception as e:
            logging.error(
                f"An error occurred while processing worksheet {worksheet['name']}: {e}"
            )
            failed_updates.append((worksheet["name"], str(e)))

    if len(failed_updates) > 0:
        response_body = "Not all worksheets could be updated"
    else:
        response_body = "All worksheets updated successfully"

    return {
        "statusCode": 200,
        "body": {
            "message": response_body,
            "updated_worksheets": updated,
            "failed_updates": failed_updates,
        },
    }
