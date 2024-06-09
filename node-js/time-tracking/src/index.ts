import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb"
import Database from "./lib/Database"
import { getEntries } from "./lib/getEntries"
import { addEntries } from "./lib/addEntries"
import { buildHttpResponse } from "./lib/buildHttpResponse"
import { client } from "./lib/connect"

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      console.log(process.env)
      const command = new ListTablesCommand({})
      const response = await client.send(command)
      return {
         statusCode: 200,
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            message: "Successfully retrieved tables",
            tableNames: response.TableNames,
         }),
      }

      // Connect to DB and establish pool connection
      // const db = Database.getInstance()
      // const pool = db.getPool()

      // switch (event?.httpMethod) {
      //    case "GET":
      //       return event.resource === "/fetch"
      //          ? await getEntries(event, pool)
      //          : buildHttpResponse(404, "Resource not found")
      //    case "POST":
      //       return event.resource === "/update"
      //          ? await addEntries(event)
      //          : buildHttpResponse(404, "Resource not found")
      //    default:
      //       return buildHttpResponse(405, `HTTP method ${event.resource} not allowed.`)
      // }
   } catch (err) {
      console.error("Error:" + err)
      return buildHttpResponse(500, "An internal server error occurred")
   }
}
