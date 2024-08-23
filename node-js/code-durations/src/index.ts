import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { getDateRange } from "./lib/getDateRange"
import { parseData } from "./lib/parseData"
const { WAKATIME_API_KEY } = process.env

const headersAll = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const timePeriod = event.queryStringParameters?.timePeriod
            const encodedKey = Buffer.from(WAKATIME_API_KEY as string).toString("base64")
            const headers: AxiosRequestConfig = {
                headers: {
                    ...headersAll,
                    Authorization: `Basic ${encodedKey}`,
                },
            }

            const response: AxiosResponse = await axios.get(
                `https://wakatime.com/api/v1/users/current/summaries?${getDateRange(timePeriod)}`,
                headers,
            )

            const data = parseData(response?.data)

            return {
                statusCode: 200,
                body: JSON.stringify({
                    data: data,
                    message: "Successfully retrieved time entries",
                }),
                headers: headersAll,
            }
        } catch (error) {
            if (attempt === MAX_RETRIES - 1 || !axios.isAxiosError(error) || error.response!.status < 500) {
                console.log(error)
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        message: error instanceof Error ? error.message : "An unknown error occurred",
                    }),
                    headers: headersAll,
                }
            }
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
        }
    }
    throw new Error("Unexpected: Max retries reached without returning")
}

function handleError(error: unknown): APIGatewayProxyResult {
    console.error(error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return {
        statusCode: 500,
        body: JSON.stringify({ message: errorMessage }),
        headers: headersAll,
    }
}
