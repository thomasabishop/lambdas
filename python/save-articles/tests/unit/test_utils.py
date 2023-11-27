import logging, sys, datetime
from typing import List

parentdir = "/home/thomas/repos/lambdas/python/save-articles/src"
sys.path.insert(0, parentdir)

from lib import utils

"""
Test convert_unix_timestamp
"""


def test_convert_unix_timestamp_success():
    """
    It should convert a unix timestamp to a readable date
    """

    # Convert string timestamp
    string_result = utils.convert_unix_timestamp("1688582410")
    assert string_result == "05-07-2023"

    # Convert integer timestamp
    int_result = utils.convert_unix_timestamp(1688582410)
    assert int_result == "05-07-2023"


def test_convert_unix_timestamp_failure(caplog):
    with caplog.at_level(logging.ERROR):
        result = utils.convert_unix_timestamp(None)
        assert result == "undefined"
        assert "No timestamp provided" in caplog.text


"""
Test sort_multidimensional_list
"""


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
