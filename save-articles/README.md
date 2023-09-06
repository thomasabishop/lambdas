# save-articles

Retrieve articles by tag from the Pocket API and inject into Google Sheets worksheet.

```mermaid
%%{init: {'theme':'default'}}%%
flowchart LR
    A[AWS EventBridge timer] --> |triggers| B("AWS Lambda")
    B <--> |GET| C("pocket-api" lambda: /query-pocket)
    C -->  |retrieves| D["saved articles"]
    B --> |POST| E("gsheet-utils" lambda: /update-sheet)
    E --> |updates| F["Google Sheet"]
```

## Environment variables

| Variable                  | Description                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `POCKET_LAMBDA_ENDPOINT`  | AWS API Gateway endpoint for [pocket-api lambda](https://github.com/thomasabishop/lambdas/tree/main/pocket-api) |
| `GSHEETS_LAMBDA_ENDPOINT` | AWS API Gateway endpoint for [gsheet-utils lambda]()                                                            |
