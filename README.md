# Lambdas

Monorepo for my AWS Lambda functions

| Lambda                                                                              | Runtime      | Language   | Description                                                                                                                           |
| ----------------------------------------------------------------------------------- | ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [activities](https://github.com/thomasabishop/lambdas/tree/main/activities)         | `nodejs18.x` | TypeScript | Return data from Toggl API                                                                                                            |
| [code-metrics](https://github.com/thomasabishop/lambdas/tree/main/code-metrics)     | `nodejs16.x` | TypeScript | Return data from a variety of third-party APIs to create [dashboard](https://systemsobscure.blog/code-metrics/) of my coding activity |
| [code-durations](https://github.com/thomasabishop/lambdas/tree/main/code-durations) | `nodejs20.x` | TypeScript | Return coding duration data from WakaTime API                                                                                         |
| [code-stats](https://github.com/thomasabishop/lambdas/tree/main/code-stats)         | `nodejs20.x` | TypeScript | Return subset of metrics from WakaTime API                                                                                            |
| [pocket-api](https://github.com/thomasabishop/lambdas/tree/main/pocket-api)         | `nodejs16.x` | TypeScript | Return saved [Pocket](https://getpocket.com) articles by tag                                                                          |
| [save-articles](https://github.com/thomasabishop/lambdas/tree/main/save-articles)   | `python3.10` | Python     | Save articles to Google Sheets to read later                                                                                          |
