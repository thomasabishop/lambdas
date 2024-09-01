import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb"

const getYearEntries = async (client: DynamoDBClient) => {
   const docClient = DynamoDBDocumentClient.from(client)
   const twelveMonthsAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
   let items = []
   let lastEvaluatedKey: Record<string, any> | undefined
   do {
      const { Items, LastEvaluatedKey } = await docClient.send(
         new ScanCommand({
            TableName: "TimeEntries",
            FilterExpression: "#start >= :twelveMonthsAgo",
            ExpressionAttributeNames: { "#start": "start" },
            ExpressionAttributeValues: { ":twelveMonthsAgo": twelveMonthsAgo },
            ExclusiveStartKey: lastEvaluatedKey,
         }),
      )
      items.push(...(Items || []))
      lastEvaluatedKey = LastEvaluatedKey
   } while (lastEvaluatedKey)
   return items.map((item) => ({ ...item, year: item.year.replace("\r", "") }))
}

export { getYearEntries }
