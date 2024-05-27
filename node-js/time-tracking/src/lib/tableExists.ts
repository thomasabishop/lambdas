import { Pool } from "mysql2/promise"
import { RowDataPacket } from "mysql2/promise"

interface ITableCount extends RowDataPacket {
   count: number
}

const generateQuery = (database: string, table: string): string => {
   return `
		SELECT COUNT(*) AS count
    FROM information_schema.tables 
    WHERE table_schema = '${database}' 
    AND table_name = '${table}
	`
}

const tableExists = async (
   poolConnection: Pool,
   database: string,
   table: string,
): Promise<boolean> => {
   const QUERY = generateQuery(database, table)
   const [rows] = await poolConnection.query<ITableCount[]>(QUERY)
   if (rows[0].count === 1) {
      return true
   } else {
      console.error(`The table ${table} does not exist in database ${database}`)
      return false
   }
}

export { tableExists }
