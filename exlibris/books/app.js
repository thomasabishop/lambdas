import mysql from "mysql2/promise"

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
}

export const handler = async (event) => {
    let connection
    try {
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
