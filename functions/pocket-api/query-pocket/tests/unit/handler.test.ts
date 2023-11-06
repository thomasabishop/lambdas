/// <reference types="@types/jest" />;
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { handler } from "../../index"
import { expect, describe, it } from "@jest/globals"
import mockApiGatewayProxyEvent from "../fixtures/event.json"
import mockPocketApiResponse from "../fixtures/pocket-api-response.json"
import axios from "axios"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock("../../helpers/getPocketCredentials", () => ({
    getPocketCredentials: jest.fn().mockReturnValue({
        accessToken: "mockAccessToken",
        consumerKey: "mockConsumerKey",
    }),
}))

describe("handler", () => {
    it("successfully returns Pocket API data for the given Pocket tag passed as query parameter", async () => {
        ;(mockedAxios.post as jest.Mock).mockResolvedValue({
            data: mockPocketApiResponse,
            status: 200,
            statusText: "OK",
            headers: {},
            config: {},
        })

        const event: APIGatewayProxyEvent = {
            ...mockApiGatewayProxyEvent,
            queryStringParameters: {
                tag: "gaby",
            },
        }

        const result: APIGatewayProxyResult = await handler(event)
        const [endpoint, body] = mockedAxios.post.mock.calls[0]

        expect(result.statusCode).toEqual(200)
        expect(endpoint).toEqual("https://getpocket.com/v3/get")
        expect(body).toEqual({
            consumer_key: "mockConsumerKey",
            access_token: "mockAccessToken",
            state: "all",
            tag: "gaby",
        })
        expect(result.body).toEqual(
            JSON.stringify({
                data: mockPocketApiResponse,
            }),
        )
    })

    it("returns 500 when a general error is thrown", async () => {
        const errorMessage = "An error occurred"
        jest.spyOn(console, "error").mockImplementation(() => {})
        ;(mockedAxios.post as jest.Mock).mockRejectedValue(new Error(errorMessage))

        const result: APIGatewayProxyResult = await handler(mockApiGatewayProxyEvent)

        expect(result.statusCode).toEqual(500)
        expect(result.body).toEqual(
            JSON.stringify({
                message: errorMessage,
            }),
        )
    })
})
