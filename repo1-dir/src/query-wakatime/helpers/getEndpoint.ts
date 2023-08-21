const getEndpoint = (path: string, timePeriod?: string | undefined) => {
    const basePath = "/users/current"
    switch (path) {
        case "/query-wakatime/main-metrics":
            return `${basePath}/stats/${timePeriod}`
        case "/query-wakatime/durations":
            return `${basePath}/summaries?range=${timePeriod}`
        case "/query-wakatime/today-only":
            return `${basePath}/status_bar/today`
    }
}

export { getEndpoint }
