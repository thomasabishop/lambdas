import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { getApiKey } from "./helpers/getApiKey"
import { base64Encode } from "./helpers/base64Encode"
import { RequestInit } from "node-fetch"
import { fetchData } from "./helpers/fetchData"
import { constructStatsEndpoint } from "./helpers/constructStatsEndpoint"
import { TWakatimeStatusbar } from "./types/TWakatimeStatusbar"
import { TWakatimeStats } from "./types/TWakatimeStats"
import { TWakatimeSummaries } from "./types/TWakatimeSummaries"
const responseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
}

export interface IQueryWakatimeResponse {
    codingTimeToday: string
    codingTimeTotal: string
    codingTimeDailyAverage: string
    codingTimeBestDay: string
    programmingLanguages: {
        name: string
        decimal: string
    }[]
    operatingSystems: {
        name: string
        percent: number
    }[]
    codingDurations?: {
        date: string
        duration: string
    }[]
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult
    try {
        const timePeriod = event.queryStringParameters?.timePeriod
        const apiKey = await getApiKey()
        console.log(apiKey)
        const encodedApiKey = base64Encode(apiKey)
        console.log("encoded: " + encodedApiKey)
        const init: RequestInit = {
            headers: {
                Authorization: `Basic ${encodedApiKey}`,
            },
        }

        const [statusbar, stats, summaries]: [TWakatimeStatusbar, TWakatimeStats, TWakatimeSummaries] =
            await Promise.all([
                fetchData("/users/current/status_bar/today", init),
                fetchData(`/users/current/stats/${timePeriod}`, init),
                fetchData(`/users/current/summaries?${constructStatsEndpoint(timePeriod)}`, init),
            ])

        const data: IQueryWakatimeResponse = {
            codingTimeToday: statusbar?.data?.grand_total?.text,
            codingTimeTotal: stats?.data?.human_readable_total,
            codingTimeDailyAverage: stats?.data?.human_readable_daily_average,
            codingTimeBestDay: stats?.data?.best_day?.text,
            programmingLanguages: stats?.data?.languages.map((lang: any) => ({
                name: lang?.name,
                decimal: lang?.decimal,
            })),
            operatingSystems: stats?.data?.operating_systems.map((os: any) => ({
                name: os?.name,
                percent: os?.percent,
            })),
            codingDurations: summaries.data?.map((day: any) => ({
                date: day?.range?.text,
                duration: day?.grand_total?.decimal,
            })),
        }

        response = {
            statusCode: 200,
            body: JSON.stringify(data),
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
