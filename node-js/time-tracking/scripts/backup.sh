#!/bin/bash

SOURCE_PROFILE="timetracking_dev"
DEST_PROFILE="timetracking_dev"
TABLE="TimeEntries"
DEST_TABLE="TimeEntries"  # Make sure this is correct
PAGE_SIZE=500
MAX_ITEMS=10000

DATE="$(date +"%Y-%m-%dT%H:%M:%SZ")"
FILENAME="TimeEntries_bak_${DATE}.json"

aws dynamodb scan \
	--table-name "$TABLE" \
  --endpoint-url="http://localhost:8000" \
  --select ALL_ATTRIBUTES \
  --page-size "$PAGE_SIZE" \
  --max-items "$MAX_ITEMS" \
  --output json \
	--profile "$SOURCE_PROFILE" > ../backups/"$FILENAME"


