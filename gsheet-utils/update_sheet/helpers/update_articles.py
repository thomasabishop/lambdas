import datetime

"""Utils for updating a list of article entries in Google sheets"""


def remove_duplicate_entries(entries, unique_key_index):
    unique_dict = {x[unique_key_index]: x for x in entries}
    unique_entries = list(unique_dict.values())
    return unique_entries


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


def add_entries_to_sheet(sheet_ref, new_data):
    """Write updated data to sheet"""
    existing_entries = sheet_ref.get_all_values()
    merged_entries = existing_entries + new_data
    deduped = remove_duplicate_entries(merged_entries, 1)
    date_sorted = sort_by_date(deduped)
    # learning exercise: convert this map into list comprehension
    readable_date = list(map(lambda i: [timestamp_to_date(i[0])] + i[1:], date_sorted))
    sheet_ref.clear()
    sheet_ref.insert_rows(readable_date, 1)
