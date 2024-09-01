import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { ITimeEntry, getTimeEntries } from "./lib/getTimeEntries"
import { addTimeEntries } from "./lib/addTimeEntries"
import { buildHttpResponse } from "./lib/buildHttpResponse"
import { client } from "./lib/connect"
import { TPeriod } from "./lib/generateDates"
import { getYearEntries } from "./lib/getYearEntries"
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      switch (event?.httpMethod) {
         case "GET":
            if (event.resource === "/fetch") {
               // const timePeriod = event?.queryStringParameters?.period as TPeriod
               //		const timeEntries = await getTimeEntries(client, timePeriod)
               const yearEntries = await getYearEntries(client)
               return buildHttpResponse(200, yearEntries)
               // return buildHttpResponse(200, timeEntries)
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
