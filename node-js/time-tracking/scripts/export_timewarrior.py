#! /usr/local/bin/python3

# Export time entries from TimeWarrior CLI and return as CSV or JSON stdout 

import sys
import csv
import subprocess
import json
import warnings
from datetime import datetime


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


def get_tw_entries():
    time_entries = execute_shell_command("timew export")
    return json.loads(time_entries)


def utc_to_sql_stamp(utc):
    datetime_obj = datetime.strptime(utc, "%Y%m%dT%H%M%SZ")
    sql_stamp = datetime_obj.strftime("%Y-%m-%d %H:%M:%S")
    return sql_stamp


def get_entry_duration(utc1, utc2):
    utc1_object = datetime.strptime(utc1, "%Y%m%dT%H%M%SZ")
    utc2_object = datetime.strptime(utc2, "%Y%m%dT%H%M%SZ")

    time_difference = utc2_object - utc1_object
    difference_seconds = time_difference.total_seconds()
    return seconds_to_digital_time(difference_seconds)


def active_timer():
    status = execute_shell_command("timew get dom.active")
    return True if status == "1" else False


def get_tags(tag_list):
    if len(tag_list) > 0:
        return tag_list
    else:
        warnings.warn("No tag data")
        return ["null", "null"]


def export_to_csv(entries):
    with open("exported_time_entries.csv", mode="w") as export_file:
        writer = csv.writer(export_file)
        for entry in entries:
            try:
                csv_row = [
                    entry.get("activity_type", "null"),
                    entry.get("start", "null"),
                    entry.get("end", "null"),
                    entry.get("duration", "null"),
                    entry.get("description", "null"),
                ]
                writer.writerow(csv_row)
            except TypeError:
                print(f"Error: {TypeError}")

        print('Exported time entries to file: exported_time_entries.csv')

def export_entries(export_type=None):
    processed = []
    entries = get_tw_entries()
    for entry in entries:
        tags = get_tags(entry["tags"])
        start_sql_stamp = utc_to_sql_stamp(entry["start"])
        end_sql_stamp = utc_to_sql_stamp(entry["end"])
        duration = get_entry_duration(entry["start"], entry["end"])

        processed.append(
            {
                "activity_type": tags[0],
                "start": start_sql_stamp,
                "end": end_sql_stamp,
                "duration": duration,
                "description": tags[1],
            }
        )

    if export_type == "csv":
        return export_to_csv(processed)
    else:
        return processed 
    

def main():
    export_type = sys.argv[1] if len(sys.argv) > 1 else None
    try:
        active = False

        if active_timer():
            active = True
            execute_shell_command("timew stop")

        export = export_entries(export_type)
        print(export)

        if active:
            execute_shell_command("timew continue")

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
