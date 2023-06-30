const fixedTimePeriods = ["last_7_days", "last_30_days"]

function generateDateParameters(period: string) {
    let end = new Date()
    let start = new Date()

    switch (period) {
        case "last_6_months":
            start.setMonth(start.getMonth() - 6)
            break
        case "last_year":
            start.setFullYear(start.getFullYear() - 1)
            break
        default:
            return "Invalid period"
    }

    const formatDate = (date: Date) => {
        let month = "" + (date.getMonth() + 1),
            day = "" + date.getDate(),
            year = date.getFullYear()

        if (month.length < 2) month = "0" + month
        if (day.length < 2) day = "0" + day

        return [year, month, day].join("-")
    }

    return `start=${formatDate(start)}&end=${formatDate(end)}`
}

const constructStatsEndpoint = (timePeriod?: string | undefined) => {
    if (timePeriod !== undefined) {
        if (fixedTimePeriods.includes(timePeriod)) {
            return `range=${timePeriod}`
        } else {
            console.log(generateDateParameters(timePeriod))
            return generateDateParameters(timePeriod)
        }
    }
}

export { constructStatsEndpoint }
