import { Pool } from "mysql2/promise"
import { RowDataPacket } from "mysql2/promise"
const { DB_NAME } = process.env
const tableName = "time_entries"

interface IExistingTableCount extends RowDataPacket {
   count: number
}

const TABLE_EXISTS = `
    SELECT COUNT(*) AS count
    FROM information_schema.tables 
    WHERE table_schema = '${DB_NAME}' 
    AND table_name = '${tableName}'
`

const CREATE_TABLE = `
    CREATE TABLE ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        activity_type VARCHAR(255),
        \`start\` DATETIME NOT NULL,
        \`end\` DATETIME NOT NULL,
        duration DECIMAL(10, 2),
        description VARCHAR(255),
        UNIQUE KEY unique_time_entry (activity_type, \`start\`, \`end\`)
    )
`

const createTable = async (pool: Pool): Promise<void> => {
   try {
      const [rows] = await pool.query<IExistingTableCount[]>(TABLE_EXISTS)
      const exists = rows[0].count === 1
      if (!exists) {
         console.info(`Table ${tableName} does not exist. Creating...`)
         await pool.query(CREATE_TABLE)
      } else {
         console.info(`Table ${tableName} exists. Skipping table creation.`)
      }
   } catch (error) {
      console.error("Error checking or creating table:", error)
   }
}

export { createTable }
