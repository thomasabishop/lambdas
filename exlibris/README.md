# exlibris

> The backend for my reading log. Creates and interacts with MySQL database that stores book data.

## Environment variables

| Variable    | Description                                         |
| ----------- | --------------------------------------------------- |
| DB_HOST     | Same as DB_NAME (linked to network in local Docker) |
| DB_USER     | Database user to connect as                         |
| DB_PASSWORD | Database user password                              |
| DB_NAME     | `exlibris`                                          |
| DB_PORT     | 3306                                                |

## Local development

### Docker

Docker is used in local development to create a local instance of the MySQL database. The standard `mysql` image from the Docker registry is used.

This is utilised along side the AWS Single Application Model (SAM) which handles the execution of the Node.js lambda and the local API that triggers it.

The Docker container responsible for SAM and its API is able to communicate with the Docker container running the database because they each have access to the same Docker network: `exlibris-network`.

#### Docker daemon (Arch Linux)

```sh
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl status docker
```

#### Docker network

##### Create network

```
 docker network create exlibris-network
```

##### List running networks

```
docker network ls
NETWORK ID     NAME               DRIVER    SCOPE
e25c4b999ef0   exlibris-network   bridge    local
```

#### Create and start the MySQL database container

```
docker run --name exlibris-db \
           -e MYSQL_ROOT_PASSWORD=xxxx \
           -e MYSQL_DATABASE=exlibris \
           -e MYSQL_USER=xxxx \
           -e MYSQL_PASSWORD=xxxx \
           -p 3306:3306 \
           -d mysql:5.7
```

#### Controlling the Docker container

```
docker start exlibris-db
docker stop exlibris-db
```

### List all containers

```
docker container ls
```

### List running containers

```
docker ps
```

## MySQL

### Create the main table

```sql
CREATE TABLE `exlibris`.`books` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `genre` VARCHAR(45) NOT NULL,
  `pub_year` VARCHAR(45) NOT NULL,
  `date_read` VARCHAR(45) NOT NULL,
  `author` VARCHAR(45) NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));
```
