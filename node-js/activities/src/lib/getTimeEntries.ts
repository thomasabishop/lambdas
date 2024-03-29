import { TProjectMap } from "./getProjects"
import { TogglClient } from "./TogglClient"
import { getDateRange } from "./getDateRange"
import { formatTime } from "./formatTime"
import { DateRange } from "./getDateRange"
import { formatLongDate } from "./formatLongDate"
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
            return timeEntries
                .map((entry: ITogglTimeEntry) => ({
                    project: projects[entry.project_id],
                    date: formatLongDate(entry.at),
                    duration: formatTime(entry.duration),
                    task_description: entry.description,
                }))
                .reverse()
        }
    } catch (error: unknown) {
        console.error(error)
    }
}

export { getTimeEntries }
