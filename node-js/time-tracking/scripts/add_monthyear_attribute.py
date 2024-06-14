import json
from dateutil import parser

# Function to add monthYear attribute
def add_month_year_to_data(data):
    for entry in data["DataModel"]:
        if "TableData" in entry:
            for item in entry["TableData"]:
                # Parse the start date
                start_date = item["start"]["S"]
                date = parser.parse(start_date)
                # Format monthYear and add to the item
                year = date.strftime('%Y')
                item["year"] = {"S": year}
                del item["month_year"]
    return data

# Read the JSON data from a file
def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

# Write the updated JSON data to a file
def write_json_file(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)

# Example usage
if __name__ == "__main__":
    # Load data from a JSON file
    file_path = '/home/thomas/repos/lambdas/node-js/time-tracking/exports/TimeEntriesModelOld.json'  # Replace with your actual JSON file path
    data = read_json_file(file_path)
    
    # Add monthYear attribute
    updated_data = add_month_year_to_data(data)
    
    # Save updated data back to a new JSON file or print it
    output_file_path = 'updated_json_file_path_here.json'  # Replace with your desired output file path
    write_json_file(updated_data, output_file_path)
    # Alternatively, print the updated data
    #print(json.dumps(updated_data, indent=2))

