import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { handler } from "../../index"
import { expect, describe, it } from "@jest/globals"
import mockApiGatewayProxyEvent from "../fixtures/event.json"
describe("handler", () => {
    it("verifies successful response", async () => {
        const result: APIGatewayProxyResult = await handler(mockApiGatewayProxyEvent)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toEqual(
            JSON.stringify({
                message: "hello world",
            }),
        )
    })
})
