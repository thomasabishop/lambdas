import mysql, { PoolOptions } from "mysql2/promise"

const { DB_NAME, DB_USER, DB_PASSWORD } = process.env

const credentials: PoolOptions = {
   host: "172.17.0.1",
   user: DB_USER,
   database: DB_NAME,
   password: DB_PASSWORD,
}

const connection = mysql.createPool(credentials)

export { connection }
