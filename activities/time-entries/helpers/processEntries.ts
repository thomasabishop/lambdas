import { getProjects } from "./getProjects"

interface ITimeEntry {
    id: number
    project_id: number
    duration: number
    at: string
    [key: string]: unknown
}

const processEntries = async (timeEntries: ITimeEntry[]) => {
    // const projects = await getProjects()
    const processedEntries = timeEntries.map((entry) => {
        return {
            id: entry.id,
            project: entry.project_id,
            duration: secondsToDecimalTime(entry.duration),
            date: entry.at,
        }
    })
    return processedEntries
}

const secondsToDecimalTime = (seconds: number): number => {
    return parseFloat((seconds / 3600).toFixed(2))
}

export { secondsToDecimalTime, processEntries }
