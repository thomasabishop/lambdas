import mysql, { Pool, PoolOptions } from "mysql2/promise"

const { DB_NAME, DB_USER, DB_PASSWORD } = process.env

class Database {
   private static instance: Database
   private pool: Pool

   private constructor() {
      const credentials: PoolOptions = {
         host: "172.17.0.1",
         user: DB_USER,
         database: DB_NAME,
         password: DB_PASSWORD,
      }

      this.pool = mysql.createPool(credentials)
   }

   public static getInstance(): Database {
      if (!Database.instance) {
         Database.instance = new Database()
      }
      return Database.instance
   }

   public getPool(): Pool {
      return this.pool
   }
}

export default Database
