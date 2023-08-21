import * as AWS from "aws-sdk"

/**
 * Retrieves the API key from the AWS Secrets Manager or if local the environment variables.
 *
 */

const getApiKey = async (): Promise<string> => {
    const secretsManager = new AWS.SecretsManager()
    if (process.env.NODE_ENV === "production") {
        const response = await secretsManager.getSecretValue({ SecretId: process.env.SECRET_ARN as string }).promise()
        const secretValues = JSON.parse(response.SecretString as string)
        return secretValues.WAKATIME_API_KEY
    } else {
        return process.env.WAKATIME_API_KEY as string
    }
}

export { getApiKey }
/*  */
