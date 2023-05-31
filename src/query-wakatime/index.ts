import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { getApiKey } from "./helpers/getApiKey"
import { base64Encode } from "./helpers/base64Encode"
import { FetchClient } from "./helpers/FetchClient"
import { RequestInit } from "node-fetch"

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const fetchClient = new FetchClient("https://wakatime.com/api/v1")
    let response: APIGatewayProxyResult
    try {
        const path = event.path
        const timePeriod = event.queryStringParameters?.timePeriod
        const apiKey = await getApiKey()
        const encodedApiKey = base64Encode(apiKey)
        const init: RequestInit = {
            headers: {
                Authorization: `Basic ${encodedApiKey}`,
            },
        }

        let data = await fetchClient.get(`/users/current/stats/${timePeriod}`, init)
        let dataJson = (await data.json()) as string
        response = {
            statusCode: 200,
            body: JSON.stringify(dataJson),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
        }
    } catch (err: unknown) {
        console.error(err)
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : "some error happened",
            }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
        }
    }

    return response
}
