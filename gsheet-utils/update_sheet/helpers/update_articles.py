import datetime

"""Utils for updating a list of article entries in Google sheets"""


# TODO: removal of dupes not working


def remove_duplicate_entries(entries, unique_key_index):
    unique_dict = {x[unique_key_index]: x for x in entries}
    unique_entries = list(unique_dict.values())
    return unique_entries


def update_entries(old, new):
    """Merge old and new data, removing dupes"""
    old_unix_date = list(map(lambda i: [date_to_timestamp(i[0])] + i[1:], old))
    combined = old_unix_date + new
    deduped = remove_duplicate_entries(combined, 0)
    # seen = set()
    # filter_func = lambda x: not (tuple(x) in seen or seen.add(tuple(x)))
    # unique_combined = list(filter(filter_func, combined))
    return deduped


def sort_by_date(entries, date_index=0):
    """Sort data by descending date"""
    entries.sort(key=lambda x: int(x[date_index]), reverse=True)
    return entries


def timestamp_to_date(timestamp):
    """Convert Unix timestamp to human readable date"""

    if isinstance(timestamp, str):
        timestamp = int(timestamp)

    date_object = datetime.datetime.fromtimestamp(timestamp)
    formatted_date = date_object.strftime("%d-%m-%Y")
    return formatted_date


def date_to_timestamp(date_str):
    """Convert human readable date to Unix timestamp"""

    date_object = datetime.datetime.strptime(date_str, "%d-%m-%Y")
    timestamp = int(date_object.timestamp())

    return timestamp


def add_entries_to_sheet(sheet_ref, new_data):
    """Write updated data to sheet"""
    existing_entries = sheet_ref.get_all_values()
    entries_rows = existing_entries[0:]
    updated = update_entries(entries_rows, new_data)
    date_sorted = sort_by_date(updated)
    readable_date = list(map(lambda i: [timestamp_to_date(i[0])] + i[1:], date_sorted))
    sheet_ref.clear()
    sheet_ref.insert_rows(readable_date, 1)
