import { DateRange } from "./getDateRange"

const isValidDateRange = (dateRange: string | undefined): dateRange is DateRange => {
    return Object.values(DateRange).includes(dateRange as DateRange)
}

const validateDateRange = (dateRange: string | undefined): DateRange | undefined => {
    try {
        if (isValidDateRange(dateRange)) {
            return dateRange
        }
    } catch (error) {
        throw new Error("Invalid date range provided")
    }
}

export { validateDateRange }
