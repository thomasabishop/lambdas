import datetime

"""Utils for updating a list of article entries in Google sheets"""


def remove_duplicates(entries, unique_key):
    unique_dict = {x[unique_key]: x for x in entries}
    unique_entries = list(unique_dict.values())
    return unique_entries


def date_sort(entries, date_index=0):
    """Sort data by descending date"""
    entries.sort(key=lambda x: int(x[date_index]), reverse=True)
    return entries


def convert_timestamp(timestamp):
    """Convert Unix timestamp to readable format"""

    if isinstance(timestamp, str):
        timestamp = int(timestamp)

    date_object = datetime.datetime.fromtimestamp(timestamp)
    formatted_date = date_object.strftime("%d-%m-%Y")
    return formatted_date


def collate_entries(sheet_ref, new_entries):
    """Merge new entries with old, sort and sanitise"""
    processed_entries = date_sort(
        remove_duplicates(sheet_ref.get_all_values() + new_entries, 1)
    )

    return [[convert_timestamp(i[0])] + i[1:] for i in processed_entries]


def update_sheet(sheet_ref, new_entries):
    """Write updated data to sheet"""

    entries = collate_entries(sheet_ref, new_entries)
    sheet_ref.clear()
    sheet_ref.insert_rows(entries, 1)
