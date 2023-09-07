type PocketCredentials = {
    accessToken: string
    consumerKey: string
}

const getPocketCredentials = async (): Promise<PocketCredentials> => {
    const creds = JSON.parse(process.env.POCKET_CREDENTIALS as string)
    return {
        accessToken: creds.POCKET_ACCESS_TOKEN,
        consumerKey: creds.POCKET_CONSUMER_KEY,
    }
}

export { getPocketCredentials }
