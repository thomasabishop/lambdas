# save-articles

Retrieve articles by tag from the Pocket API and inject into Google Sheets worksheet.

![](./media/save-articles-architecture.svg)

## Environment variables

| Variable                 | Description                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `POCKET_LAMBDA_ENDPOINT` | AWS API Gateway endpoint for [pocket-api lambda](https://github.com/thomasabishop/lambdas/tree/main/pocket-api) |
| `GOOGLE_CREDS`           | Credentials for interfacing with Google Sheets API                                                              |

## Example response

```json
{
  "statusCode": 200,
  "body": {
    "message": "Not all worksheets could be updated. Check logs.",
    "updated_worksheets": ["general_articles", "gaby_articles"],
    "failed_updates": [
      { "worksheet": "technical_articles", "error": "Some error" }
    ]
  }
}
```
