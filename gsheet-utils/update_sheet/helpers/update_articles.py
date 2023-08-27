import datetime

"""Utils for updating a list of article entries in Google sheets"""


def update_entries(old, new):
    """Merge old and new data, removing dupes"""
    combined = old + new
    seen = set()
    filter_func = lambda x: not (tuple(x) in seen or seen.add(tuple(x)))
    unique_combined = list(filter(filter_func, combined))
    return unique_combined


def sort_by_date(entries, date_index=0):
    """Sort data by descending date"""
    entries.sort(key=lambda x: int(x[date_index]), reverse=True)
    return entries


def convert_timestamp(timestamp):
    """Convert unix timestamp to human readable"""

    if isinstance(timestamp, str):
        timestamp = int(timestamp)

    date_object = datetime.datetime.fromtimestamp(timestamp)
    formatted_date = date_object.strftime("%d-%m-%Y")
    return formatted_date


def add_entries_to_sheet(sheet_ref, new_data):
    """Write updated data to sheet"""
    existing_entries = sheet_ref.get_all_values()
    entries_rows = existing_entries[0:]
    updated = update_entries(entries_rows, new_data)
    date_sorted = sort_by_date(updated)
    readable_date = list(map(lambda i: [convert_timestamp(i[0])] + i[1:], date_sorted))
    sheet_ref.clear()
    sheet_ref.insert_rows(readable_date, 1)
