/// <reference types="@types/jest" />
import { expect, describe, it } from "@jest/globals"
import rawTimeEntries from "../fixtures/toggl_raw_time_entries.json"
import { TogglClient } from "../../lib/TogglClient"
import { getTimeEntries } from "../../lib/getTimeEntries"
import { DateRange } from "../../lib/getDateRange"

jest.mock("../../lib/TogglClient", () => {
    return {
        TogglClient: jest.fn().mockImplementation(() => {
            return {
                get: jest.fn().mockResolvedValue(rawTimeEntries),
            }
        }),
    }
})

describe("getTimeEntries", () => {
    const mockedTogglClient = new TogglClient()
    const mockProjects = {
        "193325937": "Blogging",
        "193325940": "Projects",
    }
    it("should return an array of time entries matching the ITimeEntry interface", async () => {
        const result = await getTimeEntries(DateRange.Week, mockedTogglClient, mockProjects)
        expect(result).toEqual([
            {
                date: "2023-09-21",
                duration: "0.50",
                project: "Blogging",
                task_description: "pytest blog post",
            },
            {
                date: "2023-09-21",
                duration: "2.00",
                project: "Projects",
                task_description: "add tests pocket lambda",
            },
        ])
    })
})
