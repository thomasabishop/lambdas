import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { getDateRange } from "./lib/getDateRange"
import { parseData } from "./lib/parseData"
const { WAKATIME_API_KEY } = process.env

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const timePeriod = event.queryStringParameters?.timePeriod
        const encodedKey = Buffer.from(WAKATIME_API_KEY as string).toString("base64")
        const headers: AxiosRequestConfig = {
            headers: {
                "Content-Type": "application/json",
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
