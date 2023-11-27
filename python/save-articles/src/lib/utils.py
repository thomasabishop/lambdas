import logging, datetime
from typing import List


def sort_multidimensional_list(list: List[List], sort_key: int = 0) -> List[List]:
    return sorted(list, key=lambda x: x[sort_key], reverse=True)


def convert_unix_timestamp(timestamp: [str, int]) -> str:
    if not timestamp:
        logging.error("No timestamp provided")
        return "undefined"

    if isinstance(timestamp, str):
        timestamp = int(timestamp)

    date_object = datetime.datetime.fromtimestamp(timestamp)
    formatted_date = date_object.strftime("%d-%m-%Y")
    return formatted_date
