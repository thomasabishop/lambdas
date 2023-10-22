import { TProjectMap } from "./getProjects"
import { TogglClient } from "./TogglClient"
import { getDateRange } from "./getDateRange"
import { formatDate } from "./formatDate"
import { formatTime } from "./formatTime"
import { AxiosError } from "axios"
import { DateRange } from "./getDateRange"

interface ITogglTimeEntry {
    project_id: number
    at: string
    duration: number
    description: string
}

interface ITimeEntry {
    project: string
    date: string
    duration: string
    task_description: string
}

const getTimeEntries = async (
    dateRange: DateRange,
    togglClient: TogglClient,
    projects: TProjectMap,
): Promise<ITimeEntry[] | undefined | string> => {
    try {
        const formattedDateRange = getDateRange(dateRange)
        const timeEntries: ITogglTimeEntry[] = await togglClient.get(`me/time_entries?${formattedDateRange}`)

        if (timeEntries) {
            console.log("im called second")

            return timeEntries.map((entry: ITogglTimeEntry) => ({
                project: projects[entry.project_id],
                date: formatDate(entry.at),
                duration: formatTime(entry.duration),
                task_description: entry.description,
            }))
        }
    } catch (error: unknown) {
        console.error(error)
        if (error instanceof AxiosError && error.response && error.response.data.includes("must not be earlier than")) {
            throw new Error("No data for the selected date range")
        } else {
            throw error
        }
    }
}

export { getTimeEntries }
