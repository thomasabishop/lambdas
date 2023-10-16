/// <reference types="@types/jest" />;
import { processEntries, secondsToDecimalTime } from "../../helpers/processEntries"
import toggleApiResponse from "../fixtures/toggl-api-response.json"
import { expect, describe, it } from "@jest/globals"

jest.mock("../../helpers/getProjects", () => ({
    getProjects: jest.fn().mockReturnValue([
        { id: 193325937, name: "Project 1" },
        { id: 193325940, name: "Project 2" },
    ]),
}))

describe("processEntries", () => {
    // beforeEach(() => {})

    it("should return an array of processed time entries", async () => {
        const result = await processEntries(toggleApiResponse)
        expect(result).toEqual([
            {
                id: 3136598124,
                project: 193325937,
                duration: 0.5,
                date: "2023-09-21T20:39:54+00:00",
            },
            {
                id: 3136597694,
                project: 193325940,
                duration: 2.0,
                date: "2023-09-21T20:09:50+00:00",
            },
        ])
    })
})
