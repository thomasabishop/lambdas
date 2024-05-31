#! /usr/local/bin/python3

# Parse Toggle time-tracking CSV export, convert formats to fit DynamoDB
# time_tracking table, export as CSV

import os
import sys
import csv
from datetime import datetime

export_path = "/home/thomas/repos/lambdas/node-js/time-tracking/exports/processed_toggl_data"


def get_file_size(file_path):
    stats = os.stat(file_path)
    return stats.st_size


def seconds_to_digital_time(seconds):
    hours = seconds / 3600
    return round(hours, 2)


def convert_to_iso(date: str, time: str) -> str:
    datetime_obj = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M:%S")
    iso_string = datetime_obj.isoformat() + "Z" 
    return iso_string


def calculate_decimal_duration(iso1, iso2):
    iso1_object = datetime.strptime(iso1[:-1], "%Y-%m-%dT%H:%M:%S")
    iso2_object = datetime.strptime(iso2[:-1], "%Y-%m-%dT%H:%M:%S")

    time_difference = iso2_object - iso1_object
    difference_seconds = time_difference.total_seconds()
    return seconds_to_digital_time(difference_seconds)


if __name__ == "__main__":
    path = sys.argv[1]
    updated_rows = []
    now = datetime.now()
    timestamp = now.strftime("%Y-%m-%dT%H:%M")
    filename = '_'.join([export_path, timestamp]) + '.csv'
    with open(path, mode="r") as csv_file:
        reader = csv.DictReader(csv_file)
        line = 0
        for row in reader:
            if line > 0:
                start = convert_to_iso(row["start_date"], row["start_time"])
                end = convert_to_iso(row["end_date"], row["end_time"])
                duration = calculate_decimal_duration(start, end)
                id = '_'.join([row["activity"], start, end])
                updated_rows.append(
                    [id, row["activity"], start, end, duration, row["description"]]
                )
            line += 1
    with open(filename, mode="w") as export:
        writer = csv.writer(export)
        for element in updated_rows:
            writer.writerow(element)
    file_size = get_file_size(filename) / 1000
    print(f"Wrote data to new file: {filename} ({file_size} KB)")
