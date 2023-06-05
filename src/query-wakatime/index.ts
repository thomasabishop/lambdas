import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { getApiKey } from "./helpers/getApiKey"
import { base64Encode } from "./helpers/base64Encode"
import { FetchClient } from "./helpers/FetchClient"
import { RequestInit } from "node-fetch"
import { getEndpoint } from "./helpers/getEndpoint"

const responseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const fetchClient = new FetchClient("https://wakatime.com/api/v1/")
    let response: APIGatewayProxyResult
    try {
        const path = event.path
        const timePeriod = event.queryStringParameters?.timePeriod
        const endpoint = getEndpoint(path, timePeriod)
        const apiKey = await getApiKey()
        const encodedApiKey = base64Encode(apiKey)
        const init: RequestInit = {
            headers: {
                Authorization: `Basic ${encodedApiKey}`,
            },
        }

        if (!endpoint) {
            throw new Error("Endpoint is undefined")
        }

        let data = await fetchClient.get(endpoint, init)
        let dataJson = (await data.json()) as string

        response = {
            statusCode: 200,
            body: JSON.stringify(dataJson),
            headers: responseHeaders,
        }
    } catch (err: unknown) {
        console.error(err)
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : "some error happened",
            }),
            headers: responseHeaders,
        }
    }

    return response
}
