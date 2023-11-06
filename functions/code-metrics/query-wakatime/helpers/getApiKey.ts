/**
 * Retrieves the API key from the AWS Secrets Manager or if local the environment variables.
 *
 */

const getApiKey = async (): Promise<string> => {
    return process.env.WAKATIME_API_KEY as string
}

export { getApiKey }
