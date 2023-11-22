import mysql from "mysql2/promise"
import { testerImport } from "./helpers/tester-import.mjs"
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
}

// eslint-disable-next-line no-unused-vars
export const handler = async (event) => {
    let connection
    try {
        testerImport()
        console.log(`Connecting to DB with user: ${process.env.DB_USER}`)
        connection = await mysql.createConnection(dbConfig)

        const [results] = await connection.execute("SELECT * FROM books")

        await connection.end()

        return {
            statusCode: 200,
            body: JSON.stringify(results),
        }
    } catch (error) {
        console.error("Database or Query error: ", error)

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Error executing query or connecting to database",
                details: error.message,
            }),
        }
    } finally {
        if (connection) await connection.end()
    }
}
