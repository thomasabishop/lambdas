import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { getPocketCredentials } from "./helpers/getPocketCredentials"
import fetch, { RequestInit, Response } from "node-fetch"

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult
    const responseHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }

    const endpoint = `https://getpocket.com/v3/get`

    try {
        const { accessToken, consumerKey } = await getPocketCredentials()
        const tag = event.queryStringParameters?.tag

        const requestBody = {
            consumer_key: consumerKey,
            access_token: accessToken,
            state: "all",
            tag: tag,
        }

        const options: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF8",
            },
            body: JSON.stringify(requestBody),
        }

        const request: Response = await fetch(endpoint, options)
        const requestJson: any = await request.json()

        response = {
            statusCode: 200,
            body: JSON.stringify({
                data: requestJson,
            }),
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
