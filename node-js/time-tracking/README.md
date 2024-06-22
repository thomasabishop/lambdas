# Time Tracking

## Data model

Time entries are stored in a single DynamoDB database table named `TimeEntries`.

This table is an instance of the following model:

```json
{
  "TableName": "TimeEntries",
  "AttributeDefinitions": [
    { "AttributeName": "activity_start_end", "AttributeType": "S" },
    { "AttributeName": "year", "AttributeType": "S" },
    { "AttributeName": "start", "AttributeType": "S" }
  ],
  "KeySchema": [{ "AttributeName": "activity_start_end", "KeyType": "HASH" }],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "YearIndex",
      "KeySchema": [
        { "AttributeName": "year", "KeyType": "HASH" },
        { "AttributeName": "start", "KeyType": "RANGE" }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      },
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
      }
    }
  ],
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 1,
    "WriteCapacityUnits": 1
  }
}
```

### Key attributes:

- `activity_start_end`
  - primary key (partition key)
  - unique
- `year`
  - global secondary index (GSI) key
  - entries can be chunked by year improving retrieval time and reducing
    query times and cost
- `start`
  - main sort key for both primary key and GSI

### Non-key attributes:

- `activity_type`
- `end`
- `duration`
- `description`

## Local development

### Start local DynamoDB database via Docker

There is a container for two local DynamoDB instances and a local bridging network (`time-tracking_sam-local`) managed via Docker Compose:

| Instance | Database name       | Container name              | Port | Purpose                              |
| -------- | ------------------- | --------------------------- | ---- | ------------------------------------ |
| `dev`    | `timetracking_dev`  | `timetracking_dynamodb_dev` | 8000 | Breakable local development database |
| `stage`  | `timetracking_prod` | `timetracking_dynamodb_dev` | 8001 | Clone of current production DB       |

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

#### Database endpoints (lambda and CLI differences)

During the runtime of the lambda on the bridging network, the databases are reachable at `http://dev:8000` and `http://stage:8001`.

However, when interacting with the databases via the `aws-cli` the port is the
same but the hostname is `localhost`, e.g: `http://localhost:8000`,
`http://localhost:8001`.

So it is important to specify the local URL when using the CLI, e.g:

```sh
aws dynamodb list-tables \
    --profile timetracking_dev \
    --endpoint-url http://localhost:8000
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

#### Routes

The API Gateway server runs at `http://127.0.0.1:3000`

It exposes two endpoints:

| HTTP | Endpoint  | Query params                                            |
| ---- | --------- | ------------------------------------------------------- |
| GET  | `/fetch`  | `period` (values: `week`, `fortnight`, `month`, `year`) |
| POST | `/update` |                                                         |

`/update` expects an array of time entries matching the model defined above. For
example:

```json
 [{
    activity_start_end: 'Study_2024-05-21T06:15:00Z_2024-05-21T07:00:00Z',
    year: '2024'
    activity_type: 'Study'
    start: '2024-05-21T06:15:00Z',
    end: '2024-05-21T07:00:00Z',
    duration: 0.75,
    description: 'electronics book',
  }]
```

## Additional infrastructure

This lambda is only concerned with retrieving and adding entries to the
database. It assumes the pre-existence of the databases and tables.

There is additional infrastructure responsible for creating, seeding, and
migrating the database and exporting my time entries from the [Timewarrior](https://timewarrior.net/) program I run locally on my machine.

This is managed in the `/scripts` directory...

## Environment variables

| Variable        | Description                                     |
| --------------- | ----------------------------------------------- |
| `AWS_SAM_LOCAL` | Native to SAM. Determine if prod or dev runtime |
| `DB_ENDPOINT`   | Endpoint of DynamoDB database                   |
| `ACCESS_KEY`    | Access key ID                                   |
| `SECRET_KEY`    | Secret access key                               |

`DB_ENDPOINT` is only required when working with the local databass. The region
and credentials are sufficient to connect to the production database.
