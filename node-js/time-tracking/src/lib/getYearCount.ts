import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb"
import { IDailyCount } from "../types/types"

const getYearCount = async (client: DynamoDBClient): Promise<IDailyCount[]> => {
   const docClient = DynamoDBDocumentClient.from(client)
   const now = new Date()
   const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())

   const { Items } = await docClient.send(
      new ScanCommand({
         TableName: "TimeEntries",
         FilterExpression: "#start >= :twelveMonthsAgo",
         ExpressionAttributeNames: {
            "#start": "start",
         },
         ExpressionAttributeValues: {
            ":twelveMonthsAgo": twelveMonthsAgo.toISOString(),
         },
      }),
   )

   const counts: Record<string, number> = {}
   Items?.forEach((item) => {
      const date = (item.start as string).split("T")[0]
      counts[date] = (counts[date] || 0) + 1
   })

   const result: IDailyCount[] = Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.date.localeCompare(a.date))

   return result
}

export { getYearCount }
