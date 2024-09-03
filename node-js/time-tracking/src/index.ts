import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { getTimeEntries } from "./lib/getTimeEntries"
import { addTimeEntries } from "./lib/addTimeEntries"
import { buildHttpResponse } from "./lib/buildHttpResponse"
import { client } from "./lib/connect"
import { getYearCount } from "./lib/getYearCount"
import { getEntriesForDate } from "./lib/getEntriesForDate"
import { ITimeEntry } from "./types/types"
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      switch (event?.httpMethod) {
         case "GET":
            if (event.resource === "/month") {
               const monthEntries = await getTimeEntries(client, "month")
               return buildHttpResponse(200, monthEntries)
            } else if (event.resource === "/count") {
               const count = await getYearCount(client)
               return buildHttpResponse(200, count)
            } else if (event.resource === "/date") {
               const date = event?.queryStringParameters?.date
               const timeEntries = await getEntriesForDate(client, date as string)
               return buildHttpResponse(200, timeEntries)
            } else {
               return buildHttpResponse(404, "Resource not found")
            }

         case "POST":
            if (event?.resource === "/update" && event?.body) {
               const items: ITimeEntry[] = JSON.parse(event?.body)
               return await addTimeEntries(client, items)
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
