import { TWakatimeStats } from "../types/TWakatimeStats"
import { TWakatimeStatusbar } from "../types/TWakatimeStatusbar"
import { TWakatimeSummaries } from "../types/TWakatimeSummaries"
import { FetchClient } from "./FetchClient"
import { RequestInit } from "node-fetch"

const fetchClient = new FetchClient("https://wakatime.com/api/v1/")

/**
 * @param endpoint : Given WakaTime endpoint
 * @param init : Required headers
 * @returns : Requested data as json
 */
const fetchData = async (
    endpoint: string,
    init: RequestInit,
): Promise<TWakatimeStatusbar | TWakatimeStats | TWakatimeSummaries | any> => {
    const response = await fetchClient.get(endpoint, init)
    return await response.json()
}

export { fetchData }
