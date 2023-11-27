import { formatDate } from "./formatDate"

export enum DateRange {
    Week = "week",
    Month = "month",
    SixMonths = "six_months",
    Year = "last_year",
}

const getDateRange = (period: DateRange, fromDate?: Date): string | null => {
    const now = fromDate ? new Date(fromDate) : new Date()
    const startDate = new Date(now)

    switch (period) {
        case DateRange.Week:
            startDate.setDate(now.getDate() - 7)
            break
        case DateRange.Month:
            startDate.setMonth(now.getMonth() - 1)
            break
        case DateRange.SixMonths:
            startDate.setMonth(now.getMonth() - 6)
            break
        case DateRange.Year:
            startDate.setFullYear(now.getFullYear() - 1)
            break
        default:
            return null // Invalid period provided
    }

    return `start_date=${formatDate(startDate)}&end_date=${formatDate(now)}`
}

export { getDateRange }
