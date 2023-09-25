import { formatDate } from "./formatDate"

const getDateRange = (period: string, fromDate?: Date): string | null => {
    const now = fromDate ? new Date(fromDate) : new Date()
    let startDate = new Date(now)

    switch (period) {
        case "last seven days":
            startDate.setDate(now.getDate() - 7)
            break
        case "last month":
            startDate.setMonth(now.getMonth() - 1)
            break
        case "last six months":
            startDate.setMonth(now.getMonth() - 6)
            break
        case "last year":
            startDate.setFullYear(now.getFullYear() - 1)
            break
        default:
            return null // Invalid period provided
    }

    return `start_date=${formatDate(startDate)}&end_date=${formatDate(now)}`
}

export { getDateRange }
