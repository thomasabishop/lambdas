#! /usr/local/bin/python3

"""
Export time entries (all or daily) from TimeWarrior CLI and return as JSON to stdout 
e.g:
    python3 ./export_timewarrior_entries.py (all)
    python3 ./export_timewarrior_entries.py today (just today's)
"""

import sys
import subprocess
import json
import warnings
from datetime import datetime

export_path = (
    "/home/thomas/repos/lambdas/node-js/time-tracking/exports/timewarrior_export"
)


def execute_shell_command(command):
    try:
        process = subprocess.run(
            [command],
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        return process.stdout.strip()
    except subprocess.CalledProcessError as e:
        return e.stderr.strip()


def seconds_to_digital_time(seconds):
    hours = seconds / 3600
    return round(hours, 2)


def utc_to_iso(utc):
    datetime_obj = datetime.strptime(utc, "%Y%m%dT%H%M%SZ")
    iso = datetime_obj.isoformat() + "Z"
    return iso


def extractYear(utc):
    datetime_obj = datetime.strptime(utc, "%Y%m%dT%H%M%SZ")
    return datetime_obj.strftime("%Y")


def get_entry_duration(utc1, utc2):
    utc1_object = datetime.strptime(utc1, "%Y%m%dT%H%M%SZ")
    utc2_object = datetime.strptime(utc2, "%Y%m%dT%H%M%SZ")

    time_difference = utc2_object - utc1_object
    difference_seconds = time_difference.total_seconds()
    return seconds_to_digital_time(difference_seconds)


def get_tags(tag_list):
    if len(tag_list) > 0:
        return tag_list
    else:
        warnings.warn("No tag data")
        return ["null", "null"]


def get_tw_entries(period):
    time_entries = execute_shell_command(f"timew export :{period}")
    return json.loads(time_entries)


def export_entries(period=None):
    processed = []
    entries = get_tw_entries(period)

    for entry in entries:
        # currently running timer will lack this property, so we skip it
        if "end" in entry:
            tags = get_tags(entry["tags"])
            start_iso_stamp = utc_to_iso(entry["start"])
            end_iso_stamp = utc_to_iso(entry["end"])
            duration = get_entry_duration(entry["start"], entry["end"])
            id = "_".join([tags[0], start_iso_stamp, end_iso_stamp])
            year = extractYear(entry["start"])
            processed.append(
                {
                    "activity_start_end": id,
                    "activity_type": tags[0],
                    "start": start_iso_stamp,
                    "end": end_iso_stamp,
                    "duration": duration,
                    "description": tags[1],
                    "year": year,
                }
            )
    return json.dumps(processed)


def main():
    period = sys.argv[1] if len(sys.argv) > 1 else None
    try:
        export = export_entries(period)
        print(export)

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
