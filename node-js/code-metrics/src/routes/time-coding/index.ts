import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { FetchClient } from "tb-fetch-client"
import { getDateRange } from "./lib/getDateRange"
import { parseData } from "./lib/parseData"
const { WAKATIME_API_KEY } = process.env
const fetchClient = new FetchClient("https://wakatime.com/api/v1/")

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const timePeriod = event.queryStringParameters?.timePeriod
        const encodedKey = Buffer.from(WAKATIME_API_KEY as string).toString("base64")
        const headers = {
            Authorization: `Basic ${encodedKey}`,
        }

        const data = parseData(
            await fetchClient.get(`users/current/summaries?${getDateRange(timePeriod)}`, { headers }),
        )

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: data,
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
        }
    }
}
