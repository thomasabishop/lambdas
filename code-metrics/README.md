# code-metrics

Return data from a variety of third-party APIs to create [dashboard](https://systemsobscure.blog/code-metrics/) of my coding activity.

```mermaid
%%{init: {'theme':'default'}}%%
flowchart LR
    A[code-metrics] --> |GET| B["/query-wakatime"]
    B --> |triggers| C("AWS Lambda")
    C <--> |fetch WakaTIme credentials| E[AWS SecretsManager]
    C --> |calls| F[WakaTime API]
```

| Endpoint          | Request type |
| ----------------- | ------------ |
| `/query-wakatime` | GET          |

## `query-wakatime`

### Query parameters

| Parameter    | Values                                                      |
| ------------ | ----------------------------------------------------------- |
| `timePeriod` | `last_7_days`, `last_30_days`, `last_6_months`, `last_year` |
