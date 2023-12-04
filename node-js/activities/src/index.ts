import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { TogglClient } from "./lib/TogglClient"
import { getProjects } from "./lib/getProjects"
import { getTimeEntries } from "./lib/getTimeEntries"
import { DateRange } from "./lib/getDateRange"
import { validateDateRange } from "./lib/validateDateRange"
const togglClient = new TogglClient()
const workspaceId = process.env.TOGGL_WORKSPACE_ID as string

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const projects = await getProjects(workspaceId, togglClient)
        const dateRange = validateDateRange(event.queryStringParameters?.date_range) || DateRange.Month

        const timeEntries = await getTimeEntries(dateRange, togglClient, projects)

        return {
            headers: headers,
            statusCode: 200,
            body: JSON.stringify({
                data: timeEntries,
                message: "Successfully retrieved time entries",
            }),
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"

        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: errorMessage,
            }),
            headers: headers,
        }
    }
}
