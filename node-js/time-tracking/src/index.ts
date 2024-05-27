import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { createTable } from "./lib/createTable"
import Database from "./lib/Database"
import { getEntries } from "./lib/getEntries"
import { buildHttpResponse } from "./lib/buildHttpResponse"

const { DB_NAME } = process.env

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      // Connect to DB and establish pool connection
      const db = Database.getInstance()
      const pool = db.getPool()

      switch (event?.httpMethod) {
         case "GET":
            if (event.resource === "/fetch") {
               return await getEntries(event, pool)
            } else {
               return buildHttpResponse(404, "Resource not found")
            }
         default:
            return buildHttpResponse(405, `HTTP method ${event.resource} not allowed.`)
      }
   } catch (err) {
      console.error("Error:" + err)
      return buildHttpResponse(500, "An internal server error occurred")
   }
}
