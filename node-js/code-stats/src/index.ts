import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
const { WAKATIME_API_KEY } = process.env

const headersAll = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
            `https://wakatime.com/api/v1/users/current/stats/${timePeriod}`,
            headers,
        )

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: response?.data?.data,
                message: "Successfully retrieved stats",
            }),
            headers: headersAll,
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: errorMessage,
            }),
            headers: headersAll,
        }
    }
}
