/**
 *
 * @param shortDate: date of the form "2021-08-01"
 * @returns date of the form "Sun Aug 01 2021"
 */

const formatLongDate = (shortDate: string) => {
    const date = new Date(shortDate)
    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
    const day = new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(date)
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)
    const year = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(date)
    return `${weekday} ${month} ${day} ${year}`
}

export { formatLongDate }
