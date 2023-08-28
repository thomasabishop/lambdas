# gsheet-utils

Utilities for interacting with the Google Sheets API.

```mermaid
%%{init: {'theme':'default'}}%%
flowchart LR
    A[gsheet-utils] --> |POST| B["/update-sheet"]
    B --> |triggers| C("AWS Lambda")
    C <--> |fetch Google credentials| E[AWS SecretsManager]
    C --> |updates| F[Google Sheet]
```

| Endpoint        | Request type |
| --------------- | ------------ |
| `/update-sheet` | POST         |

### `update-sheet`

```json
// Example body
{
  "worksheet": "worksheet_name",
  "data": [
    {
      "date_added": "1689023491",
      "article_title": "Lorem ipsum",
      "article_excerpt": "Ut enim ad minim veniam, quis nostrud exercitation...",
      "link": "https://www.example.com"
    }
  ]
}
```
