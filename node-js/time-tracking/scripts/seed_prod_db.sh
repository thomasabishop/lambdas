#!/bin/bash

# Read each item in import CSV and update production table
# Throttle to one insertion every 5s

csv_import="$1"

while IFS=, read -r -a arr; do 
			primary_key="${arr[0]}"
			activity_type="${arr[1]}"
			start="${arr[2]}"
			end="${arr[3]}"
			duration="${arr[4]}"
			description="${arr[5]}"
			year="${arr[6]}"
	
			echo "Adding entry $primary_key, $activity_type, $description"
			
			aws dynamodb execute-statement --statement "INSERT INTO TimeEntries VALUE \
			{ \
        'activity_start_end':'$primary_key', \
        'activity_type':'$activity_type', \
        'description':'$description', \
        'duration': '$duration', \
        'start':'$start', \
        'end':'$end', \
        'year':'$year' \
			}"
		  echo "Pausing for 5s before next insertion..."	
			sleep 5

done < "$csv_import"





