import fetch, { RequestInit, Response } from 'node-fetch'

export class FetchClient {
    private baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    async get(endpoint: string, init?: RequestInit): Promise<Response> {
        return this.request('GET', endpoint, init)
    }

    async post<T>(endpoint: string, body: T, init?: RequestInit): Promise<Response> {
        return this.request('POST', endpoint, {
            ...init,
            body: JSON.stringify(body),
            headers: { ...init?.headers, 'Content-Type': 'application/json' },
        })
    }

    private async request(method: string, endpoint: string, init?: RequestInit): Promise<Response> {
        const url = `${this.baseUrl}${endpoint}`
        const response = await fetch(url, { ...init, method })

        if (!response.ok) {
            throw new Error(`Fetch error: ${response.statusText}`)
        }

        return response
    }
}

// Example use of post:
// interface PostData {
//   title: string;
//   content: string;
// }

// const postData: PostData = {
//   title: 'Example Post',
//   content: 'This is an example post.',
// };

// const response = await fetchClient.post<PostData>('/posts', postData);
