/// <reference types="@types/jest" />
import { jest } from "@jest/globals"
import { expect, describe, it } from "@jest/globals"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { handler } from "../../index"
import mockHandlerEvent from "../fixtures/event.json"

import * as getProjects from "../../lib/getProjects"
import * as getTimeEntries from "../../lib/getTimeEntries"

jest.mock("../../lib/getProjects")
jest.mock("../../lib/getTimeEntries")

const mockGetProjects = getProjects.getProjects as jest.MockedFunction<typeof getProjects.getProjects>
const mockGetTimeEntries = getTimeEntries.getTimeEntries as jest.MockedFunction<typeof getTimeEntries.getTimeEntries>

describe("handler", () => {
    let queryParams: APIGatewayProxyEvent["queryStringParameters"]
    beforeEach(() => {
        mockGetProjects.mockResolvedValue({
            "193325937": "Blogging",
            "193325940": "Projects",
        })

        mockGetTimeEntries.mockResolvedValue([
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

    it("returns a successful repsonse for a valid time range", async () => {
        queryParams = {
            date_range: "week",
        }
        mockHandlerEvent.queryStringParameters = queryParams

        const result: APIGatewayProxyResult = await handler(mockHandlerEvent as APIGatewayProxyEvent)
        const response = JSON.parse(result.body)
        expect(result.statusCode).toEqual(200)
        expect(response.message).toEqual("Successfully retrieved time entries")
        expect(response.data).toHaveLength(2)
    })

    it("returns a 500 response for an invalid time range", async () => {
        jest.spyOn(console, "error").mockImplementation(() => null)
        jest.spyOn(console, "log").mockImplementation(() => null)
        queryParams = {
            date_range: "not-valid",
        }
        mockHandlerEvent.queryStringParameters = queryParams

        const result: APIGatewayProxyResult = await handler(mockHandlerEvent as APIGatewayProxyEvent)

        expect(result.statusCode).toEqual(500)
        //        expect(JSON.parse(result.body).message).toBe("Invalid date range provided")
    })
})
