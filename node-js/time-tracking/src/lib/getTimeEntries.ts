import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { generateDates, TPeriod } from "./generateDates"
import { ITimeEntry } from "../types/types"

const getTimeEntries = async (
   client: DynamoDBClient,
   timePeriod: TPeriod | null,
   singleDay?: string,
): Promise<ITimeEntry[]> => {
   const documentClient = DynamoDBDocumentClient.from(client)
   let dateParams

   if (!singleDay && timePeriod) {
      dateParams = generateDates()[timePeriod]
   } else {
      const startTime = new Date(`${singleDay} 12:00`)
      const endTime = new Date(`${singleDay} 23:00`)
      dateParams = {
         start: startTime.toISOString(),
         end: endTime.toISOString(),
         year: startTime.getFullYear().toString(),
      }
   }

   console.log(dateParams)

   const params = {
      TableName: "TimeEntries",
      IndexName: "YearIndex",
      KeyConditionExpression: "#yr = :year AND #start BETWEEN :start_date AND :end_date",
      ExpressionAttributeNames: {
         "#yr": "year",
         "#start": "start",
      },
      ExpressionAttributeValues: {
         ":year": dateParams.year,
         ":start_date": dateParams.start,
         ":end_date": dateParams.end,
      },
   }

   const command = new QueryCommand(params)
   const response = await documentClient.send(command)
   return (response?.Items as ITimeEntry[]) || []
}

export { getTimeEntries }
