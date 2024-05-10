# Tracklog

## Local development

### Start local MySQL database via docker

There are two local MySQL instances:

| Instance | Purpose                                          |
| -------- | ------------------------------------------------ |
| `local`  | Breakable local development database             |
| `stage`  | Migrated pristine clone of current production DB |

#### Prerequisites

```sh
# Docker background services working
dockerd
systemctl enable docker.service
systemctl start docker.service
```

```sh
docker-compose up [local/stage]
```

### Start API Gateway

```sh
make start
```

### Connection

When connecting to the local DB it is necessary to use the IP address of the
Docker network rather than `localhost`. Otherwise the lambda will return a
connection error.

This is typically `172.17.0.1` but may change. Identify the current address
with:

```bash
ip addr show | grep docker0
```

Therefore, the local connection parameters:

```js
const connection = await mysql.createConnection({
  host: "172.17.0.1",
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});
```

## Database

- Database credentials managed via env vars both locally and in production

- Local, development database handled via Docker and AWS SAM

- When deploying to prod, database credentials must be provided as parameters:

  ```
    aws cloud formation deploy --template-file template.yaml --stack-name
    my-stack --parameter-overrides DBUsername='username' DBPassword='password'
  ```

  > These are the credentials used to create the initial administrator account when an RDS instance is provisioned. Access to an RDS database requires a username and password for connection. This is independent of AWS IAM roles and permissions and is specific to the database itself.
