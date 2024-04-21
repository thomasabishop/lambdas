# Tracklog

## Local development

### Start local MySQL database via docker

There are two local MySQL instances:

| Instance | Purpose                                                                           |
| -------- | --------------------------------------------------------------------------------- |
| `local`  | Local development and testing                                                     |
| `stage`  | Migrated clone of current production DB for use when developing frontend features |

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

## Database

- Database credentials managed via env vars both locally and in production

- Local, development database handled via Docker and AWS SAM

- When deploying to prod, database credentials must be provided as parameters:

  ```
    aws cloud formation deploy --template-file template.yaml --stack-name
    my-stack --parameter-overrides DBUsername='username' DBPassword='password'
  ```

  > These are the credentials used to create the initial administrator account when an RDS instance is provisioned. Access to an RDS database requires a username and password for connection. This is independent of AWS IAM roles and permissions and is specific to the database itself.
