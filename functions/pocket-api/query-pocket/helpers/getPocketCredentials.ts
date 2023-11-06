type PocketCredentials = {
    accessToken: string
    consumerKey: string
}

const getPocketCredentials = async (): Promise<PocketCredentials> => {
    try {
        const creds = JSON.parse(process.env.POCKET_CREDENTIALS as string)
        return {
            accessToken: creds.POCKET_ACCESS_TOKEN,
            consumerKey: creds.POCKET_CONSUMER_KEY,
        }
    } catch (error) {
        throw new Error("Pocket credentials could not be sourced from environment variables")
    }
}

export { getPocketCredentials }
