import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import Database from "./lib/Database"
import { getEntries } from "./lib/getEntries"
import { addEntries } from "./lib/addEntries"
import { buildHttpResponse } from "./lib/buildHttpResponse"

const { DB_NAME } = process.env

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      // Connect to DB and establish pool connection
      const db = Database.getInstance()
      const pool = db.getPool()

      switch (event?.httpMethod) {
         case "GET":
            return event.resource === "/fetch"
               ? await getEntries(event, pool)
               : buildHttpResponse(404, "Resource not found")
         case "POST":
            return event.resource === "/update"
               ? await addEntries(event)
               : buildHttpResponse(404, "Resource not found")
         default:
            return buildHttpResponse(405, `HTTP method ${event.resource} not allowed.`)
      }
   } catch (err) {
      console.error("Error:" + err)
      return buildHttpResponse(500, "An internal server error occurred")
   }
}
