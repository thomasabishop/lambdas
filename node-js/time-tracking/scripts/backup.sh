#!/bin/bash

SOURCE_PROFILE="timetracking_dev"
TABLE="TimeEntries"
PAGE_SIZE=500
MAX_ITEMS=10000

DATE="$(date +"%Y-%m-%dT%H:%M:%SZ")"
FILENAME="TimeEntries_bak_${DATE}.json"
BACKUP_DIR="/home/thomas/repos/lambdas/node-js/time-tracking/backups"

aws dynamodb scan \
	--table-name "$TABLE" \
  --endpoint-url="http://localhost:8000" \
  --select ALL_ATTRIBUTES \
  --page-size "$PAGE_SIZE" \
  --max-items "$MAX_ITEMS" \
  --output json \
	--profile "$SOURCE_PROFILE" > "$BACKUP_DIR/$FILENAME"


