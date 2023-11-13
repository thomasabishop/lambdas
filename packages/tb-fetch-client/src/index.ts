import fetch, { RequestInit } from "node-fetch"

export class FetchClient {
    private baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    public async get<T>(endpoint: string, init?: RequestInit): Promise<T> {
        return this.request<T>("GET", endpoint, init)
    }

    async post<T, U>(endpoint: string, body: T, init?: RequestInit): Promise<U> {
        return this.request<U>("POST", endpoint, {
            ...init,
            body: JSON.stringify(body),
            headers: { ...init?.headers, "Content-Type": "application/json" },
        })
    }

    private async request<T>(method: string, endpoint: string, init?: RequestInit): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`
        const response = await fetch(url, { ...init, method })

        if (!response.ok) {
            throw new Error(`Fetch error: ${response.statusText}`)
        }

        return response.json() as Promise<T>
    }
}
