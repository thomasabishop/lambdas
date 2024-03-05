# Lambdas

Monorepo for my AWS Lambda functions

| Lambda                                                                              | Active | Runtime      | Language   | Description                                                  |
| ----------------------------------------------------------------------------------- | ------ | ------------ | ---------- | ------------------------------------------------------------ |
| [activities](https://github.com/thomasabishop/lambdas/tree/main/activities)         | Yes    | `nodejs18.x` | TypeScript | Return data from Toggl API                                   |
| [code-durations](https://github.com/thomasabishop/lambdas/tree/main/code-durations) | Yes    | `nodejs20.x` | TypeScript | Return coding duration data from WakaTime API                |
| [code-stats](https://github.com/thomasabishop/lambdas/tree/main/code-stats)         | Yes    | `nodejs20.x` | TypeScript | Return subset of metrics from WakaTime API                   |
| [pocket-api](https://github.com/thomasabishop/lambdas/tree/main/pocket-api)         | No     | `nodejs16.x` | TypeScript | Return saved [Pocket](https://getpocket.com) articles by tag |
| [save-articles](https://github.com/thomasabishop/lambdas/tree/main/save-articles)   | No     | `python3.10` | Python     | Save articles to Google Sheets to read later                 |
