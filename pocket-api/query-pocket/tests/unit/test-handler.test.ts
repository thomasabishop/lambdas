/// <reference types="@types/jest" />;
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { handler } from "../../index"
import { expect, describe, it } from "@jest/globals"
import { event } from "../fixtures/event"
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
    it("verifies successful response", async () => {
        ;(mockedAxios.post as jest.Mock).mockResolvedValue({
            data: {},
            status: 200,
            statusText: "OK",
            headers: {},
            config: {},
        })

        const result: APIGatewayProxyResult = await handler(event)

        expect(result.statusCode).toEqual(200)

        expect(result.body).toEqual(
            JSON.stringify({
                data: {},
            }),
        )
    })
})
