import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { getPocketCredentials } from "./helpers/getPocketCredentials"
import axios, { AxiosResponse } from "axios"

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const responseHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }

    try {
        let response: APIGatewayProxyResult
        const endpoint = `https://getpocket.com/v3/get`

        const { accessToken, consumerKey } = await getPocketCredentials()
        const tag = event.queryStringParameters?.tag

        const requestBody = {
            consumer_key: consumerKey,
            access_token: accessToken,
            state: "all",
            tag: tag,
        }

        const axiosResponse: AxiosResponse = await axios.post(endpoint, requestBody, {
            headers: {
                "Content-Type": "application/json; charset=UTF8",
            },
        })

        response = {
            statusCode: 200,
            body: JSON.stringify({
                data: axiosResponse.data,
            }),
            headers: responseHeaders,
        }
        return response
    } catch (err: unknown) {
        console.error(err)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : "An error occurred",
            }),
            headers: responseHeaders,
        }
    }
}
