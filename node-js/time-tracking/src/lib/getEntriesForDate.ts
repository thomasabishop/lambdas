import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb"
import { ITimeEntry } from "../types/types"

const getEntriesForDate = async (client: DynamoDBClient, date: string): Promise<any> => {
   const docClient = DynamoDBDocumentClient.from(client)
   const year = date.split("-")[0]

   const queryParams = {
      TableName: "TimeEntries",
      IndexName: "YearIndex",
      KeyConditionExpression: "#yr = :year AND begins_with(#start, :datePrefix)",
      ExpressionAttributeNames: {
         "#yr": "year",
         "#start": "start",
      },
      ExpressionAttributeValues: {
         ":year": year,
         ":datePrefix": date,
      },
   }
   // Attempt query first
   const { Items: queryItems } = await docClient.send(new QueryCommand(queryParams))
   console.info(date)
   if (queryItems && queryItems.length > 0) {
      console.info("Query successful.")
      return queryItems as ITimeEntry[]
   }

   // If query fails, fall back to scan
   const scanParams = {
      TableName: "TimeEntries",
      FilterExpression: "contains(#start, :date)",
      ExpressionAttributeNames: {
         "#start": "start",
      },
      ExpressionAttributeValues: {
         ":date": date,
      },
   }

   const { Items: scanItems } = await docClient.send(new ScanCommand(scanParams))
   return (scanItems as ITimeEntry[]) || []
}

export { getEntriesForDate }
