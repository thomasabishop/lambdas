/* eslint-disable @typescript-eslint/no-empty-function */
/// <reference types="@types/jest" />
import { TogglClient } from "./../../helpers/TogglClient"
import { expect, describe, it } from "@jest/globals"
import axios from "axios"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("ToggleClient", () => {
    const mockHeaders = { headers: { Authorization: "Basic bW9jay1hcGkta2V5", "Content-Type": "application/json" } }
    beforeEach(() => {
        process.env.TOGGL_API_KEY = "mock-api-key"
        mockedAxios.get.mockResolvedValue({ data: "some data" })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe("get", () => {
        it("should utilise Axios to return data from the Toggl API", async () => {
            const axiosSpy = jest.spyOn(axios, "get")
            const togglClient = new TogglClient()
            const response = await togglClient.get("workspaces/123/projects")
            expect(response).toEqual("some data")
            expect(axiosSpy).toHaveBeenCalledWith(
                "https://api.track.toggl.com/api/v9/workspaces/123/projects",
                mockHeaders,
            )
        })
        it("should return an error if the request fails", async () => {
            jest.spyOn(console, "error").mockImplementation(() => {})
            mockedAxios.get.mockRejectedValue(new Error("error details"))
            const togglClient = new TogglClient()
            const response = await togglClient.get("workspaces/123/projects")
            expect(response).toEqual(undefined)
            expect(console.error).toHaveBeenCalledWith(
                "An error occured whilst fetching data from the Toggl API: Error: error details",
            )
        })
    })
})
