import { TogglClient } from "./TogglClient"

interface IProject {
    id: number
    name: string
    [key: string]: unknown
}

export type TProjectMap = Record<IProject["id"], IProject["name"]>

const getProjects = async (workspaceId: string, togglClient: TogglClient): Promise<TProjectMap> => {
    const projects: IProject[] = await togglClient.get(`workspaces/${workspaceId}/projects`)
    return parseProjects(projects)
}

const parseProjects = (projects: IProject[]): TProjectMap => {
    return projects.reduce((projectMap: TProjectMap, project: IProject) => {
        projectMap[project.id] = project.name
        return projectMap
    }, {})
}

export { getProjects, parseProjects }
