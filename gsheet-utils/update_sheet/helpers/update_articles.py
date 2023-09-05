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
    """Convert Unix timestamp to human readable date"""

    if isinstance(timestamp, str):
        timestamp = int(timestamp)

    date_object = datetime.datetime.fromtimestamp(timestamp)
    formatted_date = date_object.strftime("%d-%m-%Y")
    return formatted_date


def collate_entries(sheet_ref, new_entries):
    processed_entries = date_sort(
        remove_duplicates(sheet_ref.get_all_values() + new_entries, 1)
    )

    return [[convert_timestamp(i[0])] + i[1:] for i in processed_entries]

    # existing_entries = sheet_ref.get_all_values()
    # merged_entries = existing_entries + new_data
    # deduped = remove_duplicate_entries(merged_entries, 1)
    # date_sorted = sort_by_date(deduped)
    # date_readable =  [[timestamp_to_date(i[0])] + i[1:] for i in date_sorted]
    # return date_readable


def update_sheet(sheet_ref, new_entries):
    """Write updated data to sheet"""
    # existing_entries = sheet_ref.get_all_values()
    # merged_entries = existing_entries + new_data
    # deduped = remove_duplicate_entries(merged_entries, 1)
    # date_sorted = sort_by_date(deduped)
    # readable_date = [[timestamp_to_date(i[0])] + i[1:] for i in date_sorted]

    entries = collate_entries(sheet_ref, new_entries)
    sheet_ref.clear()
    sheet_ref.insert_rows(entries, 1)
