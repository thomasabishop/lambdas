#!/bin/bash

SOURCE_PROFILE="timetracking_prod"
DEST_PROFILE="timetracking_dev"
TABLE="TimeEntries"
DEST_TABLE="TimeEntries" 
PAGE_SIZE=500
MAX_ITEMS=10000

SCAN_OUTPUT=$(aws dynamodb scan \
	--table-name "$TABLE" \
	--profile "$SOURCE_PROFILE" \
	--select ALL_ATTRIBUTES \
	--page-size "$PAGE_SIZE" \
	--max-items "$MAX_ITEMS" \
	--output json)

if [ $? -eq 0 ]; then
    echo "Successfully retrieved TimeEntries table data from remote DB."
    
    ITEM_COUNT=$(echo "$SCAN_OUTPUT" | jq '.Items | length')
    
    if [ "$ITEM_COUNT" -gt 0 ]; then
        echo "Found $ITEM_COUNT items to transfer."
        echo "$SCAN_OUTPUT" | jq -c '.Items[]' | while read -r ITEM; do
            ACTIVITY_START_END=$(echo "$ITEM" | jq -r '.activity_start_end.S')
            echo "Transferring item $ACTIVITY_START_END..."
            aws dynamodb put-item \
							--table-name "$DEST_TABLE" \
							--profile "$DEST_PROFILE" \
							--item "$ITEM" \
							--endpoint-url http://localhost:8000
            if [ $? -ne 0 ]; then
                echo "Failed to transfer item $ACTIVITY_START_END"
            fi
        done
    else
        echo "No items found in the source table."
    fi
else
    echo "Could not retrieve TimeEntries table data."
    exit 1
fi
