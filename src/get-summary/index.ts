import { APIGatewayProxyResult } from 'aws-lambda'
import { getApiKey } from './helpers/getApiKey'
import { base64Encode } from './helpers/base64Encode'
import { FetchClient } from './helpers/FetchClient'
import { RequestInit } from 'node-fetch'

export const handler = async (): Promise<APIGatewayProxyResult> => {
    const fetchClient = new FetchClient('https://wakatime.com/api/v1')
    let response: APIGatewayProxyResult
    try {
        const apiKey = await getApiKey()
        const encodedApiKey = base64Encode(apiKey)
        const init: RequestInit = {
            headers: {
                Authorization: `Basic ${encodedApiKey}`,
            },
        }
        let data = await fetchClient.get('/users/current/stats', init)
        let dataJson = (await data.json()) as string
        response = {
            statusCode: 200,
            body: dataJson,
        }
    } catch (err: unknown) {
        console.error(err)
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        }
    }

    return response
}
