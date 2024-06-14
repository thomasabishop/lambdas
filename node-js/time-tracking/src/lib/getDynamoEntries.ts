import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { buildHttpResponse } from "./buildHttpResponse"
import { generateDates, TPeriod } from "./generateDates"

const getDynamoEntries = async (client: DynamoDBClient, timePeriod: TPeriod) => {
   const documentClient = DynamoDBDocumentClient.from(client)
   const dateParams = generateDates()[timePeriod]
   // const { week, fortnight, month, year } = generateDates()
   // const { start, end } = month

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
   //   console.log(response?.Items)
   return buildHttpResponse(200, response?.Items)
}

export { getDynamoEntries }
