#!/bin/bash

# Read each item in import CSV and update table for specified deployment environment
# Throttle to one insertion every 5s

# Eg. python3 seed_tables.sh dev /csv/location

ENVIRONMENT=$1
CSV_IMPORT="$2"

while IFS=, read -r -a arr; do 
    PRIMARY_KEY="${arr[0]}"
    ACTIVITY_TYPE="${arr[1]}"
    START="${arr[2]}"
    END="${arr[3]}"
    DURATION="${arr[4]}"  
    DESCRIPTION="${arr[5]}"
    YEAR="${arr[6]}"     

    #  PartiQL insert statement
    QUERY="INSERT INTO TimeEntries VALUE { \
        'activity_start_end': '$PRIMARY_KEY', \
        'activity_type': '$ACTIVITY_TYPE', \
        'description': '$DESCRIPTION', \
        'duration': $DURATION, \
        'start': '$START', \
        'end': '$END', \
        'year': '$YEAR' \
    }"

    echo "Attempting to add entry $PRIMARY_KEY, $ACTIVITY_TYPE, $DESCRIPTION"
    
    case $ENVIRONMENT in
        'dev' )
            aws dynamodb execute-statement --statement "$QUERY" --profile timetracking_dev --endpoint-url http://localhost:8000 ;;
        'prod' )
            aws dynamodb execute-statement --statement "$QUERY" --profile timetracking_prod ;;
        *)
            echo "No deployment environment specified" ;;
    esac

    sleep 3

done < "$CSV_IMPORT"
