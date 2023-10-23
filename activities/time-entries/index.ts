import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { TogglClient } from "./lib/TogglClient"
import { getProjects } from "./lib/getProjects"
import { getTimeEntries } from "./lib/getTimeEntries"
import { DateRange } from "./lib/getDateRange"
import { validateDateRange } from "./lib/validateDateRange"
const togglClient = new TogglClient()
const workspaceId = process.env.TOGGL_WORKSPACE_ID as string

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const projects = await getProjects(workspaceId, togglClient)
        const dateRange = validateDateRange(event.queryStringParameters?.date_range) || DateRange.Month

        const timeEntries = await getTimeEntries(dateRange, togglClient, projects)

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: timeEntries,
                message: "Successfully retrieved time entries",
            }),
        }
    } catch (error: unknown) {
        console.log(error)
        if (error instanceof Error && error.message.includes("No data for the selected date range")) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: error.message,
                }),
            }
        }
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error,
            }),
        }
    }
}
