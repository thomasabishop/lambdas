const fixedTimePeriods = ["last_7_days", "last_30_days"]

const generateDateParameters = (period: string) => {
    const end = new Date()
    const start = new Date()

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
        const year = date.getFullYear()
        let month = "" + (date.getMonth() + 1),
            day = "" + date.getDate()
        //            year = date.getFullYear()

        if (month.length < 2) month = "0" + month
        if (day.length < 2) day = "0" + day

        return [year, month, day].join("-")
    }

    return `start=${formatDate(start)}&end=${formatDate(end)}`
}

const getDateRange = (timePeriod?: string | undefined) => {
    if (timePeriod !== undefined) {
        if (fixedTimePeriods.includes(timePeriod)) {
            return `range=${timePeriod}`
        } else {
            return generateDateParameters(timePeriod)
        }
    }
}

export { getDateRange }
