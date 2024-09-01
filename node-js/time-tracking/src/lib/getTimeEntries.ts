import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { generateDates, TPeriod } from "./generateDates"

interface ITimeEntry {
   activity_start_end: string
   year: string
   start: string
   end: string
   activity_type: string
   duration: number
   description: string
}

const getTimeEntries = async (
   client: DynamoDBClient,
   timePeriod: TPeriod,
): Promise<ITimeEntry[]> => {
   const documentClient = DynamoDBDocumentClient.from(client)
   const dateParams = generateDates()[timePeriod]
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

export { getTimeEntries, ITimeEntry }
