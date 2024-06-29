# Upload daily time-entries export from Timewarrior to remote DB

#! /usr/local/bin/python3
import subprocess
import requests
import json
import os

LAMBDA_ENDPOINT = os.getenv("ENDPOINT")
SLACK_NOTIFIER_SCRIPT = "/home/thomas/repos/slack-notifier/src/index.js"


def slack_blocks(summary, entries):
    entry_blocks = []

    for i, entry in enumerate(entries):
        if i < 10:
            entry_blocks.append(
                {
                    "type": "mrkdwn",
                    "text": f"_{entry['description']}_ ({entry['duration']} hrs)",
                }
            )

    return [
        {
            "type": "section",
            "text": {"type": "mrkdwn", "text": f"*{summary}*"},
        },
        {"type": "divider"},
        {"type": "section", "fields": entry_blocks},
    ]


def post(data, endpoint):
    try:
        response = requests.post(endpoint, json=data)
        response.raise_for_status()
    except requests.exceptions.HTTPError as err_http:
        return f"HTTP Error: {err_http}"
    except requests.exceptions.Timeout as err_timeout:
        return f"Timeout Error: {err_timeout}"
    except requests.exceptions.ConnectionError as err_conn:
        return f"Connection Error: {err_conn}"
    except requests.exceptions.RequestException as err_req:
        return f"Exception request: {err_req}"
    return response.json()


if __name__ == "__main__":
    try:
        daily_entries = subprocess.run(
            ["python", "./export_timewarrior_entries.py", "today"],
            capture_output=True,
        )
        if daily_entries.stdout:
            data = json.loads(daily_entries.stdout.decode("utf-8"))
            response = post(data, LAMBDA_ENDPOINT)
            print(response)
            slack_message = slack_blocks(
                response["data"]["summary"], response["data"]["entries"]
            )
            subprocess.run(
                [SLACK_NOTIFIER_SCRIPT, "time_tracking", "", json.dumps(slack_message)]
            )
    except Exception as e:
        print(f"Error uploading time entries data: {e}")
