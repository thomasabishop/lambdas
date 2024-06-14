# Time Tracking

## Data model

Time entries are stored in a single DynamoDB database table named `TimeEntries`.
Below is an example entry:

```json
 {
    activity_start_end: 'Study_2024-05-21T06:15:00Z_2024-05-21T07:00:00Z',
    year: '2024'
    activity_type: 'Study'
    start: '2024-05-21T06:15:00Z',
    end: '2024-05-21T07:00:00Z',
    duration: 0.75,
    description: 'electronics book',
  }
```

This table is an instance of the `TimeEntriesModel` defined as follows:

```json
"DataModel": [
    {
      "TableName": "TimeEntries",
      "KeyAttributes": {
        "PartitionKey": {
          "AttributeName": "activity_start_end",
          "AttributeType": "S"
        }
      },
      "NonKeyAttributes": [
        {
          "AttributeName": "activity_type",
          "AttributeType": "S"
        },
        {
          "AttributeName": "start",
          "AttributeType": "S"
        },
        {
          "AttributeName": "end",
          "AttributeType": "S"
        },
        {
          "AttributeName": "duration",
          "AttributeType": "N"
        },
        {
          "AttributeName": "description",
          "AttributeType": "S"
        },
        {
          "AttributeName": "year",
          "AttributeType": "S"
        }
      ],
      "GlobalSecondaryIndexes": [
        {
          "IndexName": "YearIndex",
          "KeyAttributes": {
            "PartitionKey": {
              "AttributeName": "year",
              "AttributeType": "S"
            },
            "SortKey": {
              "AttributeName": "start",
              "AttributeType": "S"
            }
          },
          "Projection": {
            "ProjectionType": "ALL"
          }
        }
      ],

```

The primary key is `activity_start_end` which concatenates the attributes
`activity`, `start`, and `end` to create a unique value.

There is one global secondary index comprising `year` as the hash key and
`start` as the range key. Chunking entries by smaller year
ranges is designed to improve retrieval time and reduce resource costs.

## Local development

### Start local DynamoDB database via docker

There is a container for two local DynamoDB instances and a local bridging network (`time-tracking_sam-local`) managed via Docker Compose:

| Instance | Container name              | Port  | Purpose                                          |
| -------- | --------------------------- | ----- | ------------------------------------------------ |
| `dev`    | `timetracking_dynamodb_dev` | 8000  | Breakable local development database             |
| `stage`  | `timetracking_dynamodb_dev` | 80001 | Migrated pristine clone of current production DB |

Start up either container:

```sh
docker-compose up dev
docker-compose up stage
```

Or both at once:

```sh
docker compose up
```

#### Prerequisites (Linux)

```sh
# Docker background services working
dockerd
systemctl enable docker.service
systemctl start docker.service
```

### Start API Gateway

For each local DynamoDB instance there is a corresponding command to run the local API Gateway against it:

```sh
make start-dev
make start-stage
```

This command sources the requisite env vars, starts the SAM container and ensures it is on the same Docker bridging network as the DynamoDB instance, e.g. equivalent to:

```sh
make build &&
sam local start-api --docker-network time-tracking_sam-local --env-vars ./env/dev.env.json
```

The local Gatweway endpoint for each is `http://127.0.0.1:3000`

## Environment variables

| Variable        | Description                                     |
| --------------- | ----------------------------------------------- |
| `AWS_SAM_LOCAL` | Native to SAM. Determine if prod or dev runtime |
| `DB_ENDPOINT`   | Endpoint of DynamoDB database                   |
| `ACCESS_KEY`    | Access key ID                                   |
| `SECRET_KEY`    | Secret access key                               |
