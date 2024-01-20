import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { base64Encode } from "./base64Encode"

class TogglClient {
    private baserl = "https://api.track.toggl.com/api/v9/"

    public async get(endpoint: string) {
        const headers = this.headers()
        try {
            const response: AxiosResponse = await axios.get(this.baseUrl + endpoint, headers)
            return response.data
        } catch (error) {
            console.error("An error occurred whilst fetching data from the Toggl API. " + error)
            throw error
        }
    }

    private auth(): string {
        return base64Encode(process.env.TOGGL_API_KEY as string)
    }

    private headers(): AxiosRequestConfig {
        return {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${this.auth()}`,
            },
        }
    }
}

export { TogglClient }
