import * as AWS from "aws-sdk"
// import * as dotenv from dotenv

type PocketCredentials = {
    accessToken: string
    consumerKey: string
}

const getPocketCredentials = async (): Promise<PocketCredentials> => {
    if (process.env.NODE_ENV === "production") {
        const secretsManager = new AWS.SecretsManager()
        const response = await secretsManager.getSecretValue({ SecretId: process.env.SECRET_ARN as string }).promise()
        const secretValues = JSON.parse(response.SecretString as string)

        if (secretValues) {
            return {
                accessToken: secretValues.POCKET_ACCESS_TOKEN,
                consumerKey: secretValues.POCKET_CONSUMER_KEY,
            }
        } else {
            throw new Error("Failed to return Pocket credentials")
        }
    } else {
        const localCredentials = JSON.parse(process.env.POCKET_CREDENTIALS as string)
        if (localCredentials) {
            return {
                accessToken: localCredentials.POCKET_ACCESS_TOKEN,
                consumerKey: localCredentials.POCKET_CONSUMER_KEY,
            }
        } else {
            throw new Error("Failed to return Pocket credentials")
        }
    }
}

export { getPocketCredentials }
