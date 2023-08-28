# pocket-api

Return saved [Pocket](https://getpocket.com) articles by tag.

```mermaid
%%{init: {'theme':'default'}}%%
flowchart LR
    A[pocket-api] --> |GET| B["/query-pocket"]
    B --> |triggers| C("AWS Lambda")
    C <--> |fetch Pocket credentials| E[AWS SecretsManager]
    C --> |calls| F[Pocket API]
```

| Endpoint        | Request type |
| --------------- | ------------ |
| `/query-pocket` | GET          |

## `query-pocket`

### Query parameters

| Parameter | Values                                    |
| --------- | ----------------------------------------- |
| `tag`     | `website`, `general`, `technical`, `gaby` |
