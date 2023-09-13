# exlibris

> CRUD operations for an SQL database that stores book data.

## Environment variables

| Variable    | Description                                         |
| ----------- | --------------------------------------------------- |
| DB_HOST     | Same as DB_NAME (linked to network in local Docker) |
| DB_USER     | Database user to connect as                         |
| DB_PASSWORD | Database user password                              |
| DB_NAME     | `exlibris`                                          |
| DB_PORT     | 3306                                                |

## Local development

Docker is used in local development to create a container named `ex-libris-db` running the MySQL database. The standard `mysql` image from the Docker registry is used.

This runs alongside the AWS Single Application Model (SAM) Docker container which handles the execution of the Node.js lambda and the local AWS Gateway API that triggers it. (This is generated automatically when you create a lambda via SAM.)

The database container and the SAM container communicate via a shared Docker network: `exlibris-network`.

### Running the database

Ensure the Docker daemon is running via `systemd`:

```
systemctl start docker
systemctl enable docker
systemctl status docker
```

If the Docker network has not yet been created:

```
docker network create exlibris-network
```

Start the MySQL database:

```
docker start exlibris-db
```

### Start the AWS Gateway local API

```
make start
```

This executes the following command:

```
sam build && sam local start-api
  --docker-network exlibris-network
  --env-vars /home/thomas/repos/lambdas/exlibris/env/local.env.json
```

Which:

- compiles the lambda function
- gives the SAM container access to the `exlibris-network`
- injects database credentials as environment variables, enabling the database connection

### Troubleshooting

To check the network is running:

```
docker network ls
```

To check both contaners have access to the network (they will be listed under the `Containers` property of the returned JSON):

```
docker network inspect exlibris-network
```
