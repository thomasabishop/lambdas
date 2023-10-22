/// <reference types="@types/jest" />
import { expect, describe, it } from "@jest/globals"
import rawProjectData from "../fixtures/toggl_raw_projects.json"
import { getProjects } from "../../helpers/getProjects"
import { TogglClient } from "../../helpers/TogglClient"

jest.mock("../../helpers/TogglClient", () => {
    return {
        TogglClient: jest.fn().mockImplementation(() => {
            return {
                get: jest.fn().mockResolvedValue(rawProjectData),
            }
        }),
    }
})

describe("getProjects", () => {
    const parsedProjects = {
        "193325937": "Blogging",
        "193325940": "Projects",
        "193326477": "Practical study",
        "193325926": "Code exercises",
        "193325907": "Technical articles and podcasts",
        "193325932": "Theoretical study",
    }

    const mockedTogglClient = new TogglClient()

    it("should return a map of project IDs to project names", async () => {
        const result = await getProjects("workspaceId", mockedTogglClient)
        expect(result).toEqual(parsedProjects)
    })

    it("should be possible to individuate a project name by the project ID", async () => {
        const result = await getProjects("workspaceId", mockedTogglClient)
        expect(result[193325937]).toEqual("Blogging")
    })
})
