#!/bin/bash

# Read each item in import CSV and update table for specified deployment environment
# Throttle to one insertion every 5s

environment=$1
csv_import="$2"

while IFS=, read -r -a arr; do 
    primary_key="${arr[0]}"
    activity_type="${arr[1]}"
    start="${arr[2]}"
    end="${arr[3]}"
    duration="${arr[4]}"  
    description="${arr[5]}"
    year="${arr[6]}"     

    #  PartiQL insert statement
    query="INSERT INTO TimeEntries VALUE { \
        'activity_start_end': '$primary_key', \
        'activity_type': '$activity_type', \
        'description': '$description', \
        'duration': $duration, \
        'start': '$start', \
        'end': '$end', \
        'year': '$year' \
    }"

    echo "Attempting to add entry $primary_key, $activity_type, $description"
    
    case $environment in
        'dev' )
            aws dynamodb execute-statement --statement "$query" --profile timetracking_dev --endpoint-url http://localhost:8000 ;;
        'stage' )
            aws dynamodb execute-statement --statement "$query" --profile timetracking_dev --endpoint-url http://localhost:8001 ;;
        *)
            aws dynamodb execute-statement --statement "$query" --profile timetracking_prod ;;  
    esac

    sleep 3

done < "$csv_import"
