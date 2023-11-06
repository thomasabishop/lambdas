import { TogglClient } from "./TogglClient"

/**
 * Return projects for the given Toggl workspace
 */

interface IProject {
    id: number
    name: string
    [key: string]: unknown
}

type TProjectMap = Record<IProject["id"], IProject["name"]>

const getProjects = async (): Promise<TProjectMap> => {
    const workspace = process.env.TOGGL_WORKSPACE_ID
    const togglClient = new TogglClient()
    const projects: IProject[] = await togglClient.get(`workspaces/${workspace}/projects`)
    return parseProjects(projects)
}

const parseProjects = (projects: IProject[]): TProjectMap => {
    return projects.reduce((projectMap: TProjectMap, project: IProject) => {
        projectMap[project.id] = project.name
        return projectMap
    }, {})
}

export { getProjects, parseProjects }
