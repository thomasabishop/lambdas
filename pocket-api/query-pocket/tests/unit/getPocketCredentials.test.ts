import { getPocketCredentials } from "../../helpers/getPocketCredentials"

describe("getPocketCredentials", () => {
    it("returns the Pocket credentials from the environment variables", async () => {
        const mockPocketCredentials = {
            POCKET_ACCESS_TOKEN: "mockAccessToken",
            POCKET_CONSUMER_KEY: "mockConsumerKey",
        }
        process.env.POCKET_CREDENTIALS = JSON.stringify(mockPocketCredentials)

        const result = await getPocketCredentials()

        expect(result).toEqual({
            accessToken: mockPocketCredentials.POCKET_ACCESS_TOKEN,
            consumerKey: mockPocketCredentials.POCKET_CONSUMER_KEY,
        })
    })

    it("throws an error when the Pocket credentials cannot be sourced from the environment variables", async () => {
        delete process.env.POCKET_CREDENTIALS
        await expect(getPocketCredentials()).rejects.toThrow(
            "Pocket credentials could not be sourced from environment variables",
        )
    })
})
