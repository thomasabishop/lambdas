# Time Tracking

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
