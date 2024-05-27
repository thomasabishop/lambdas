import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Pool } from "mysql2/promise"
import { buildHttpResponse } from "./buildHttpResponse"

const table = "time_entries"

type TPeriod = "week" | "fortnight" | "month" | "year" | "all"

const GET_ALL = `
	SELECT * FROM ${table} 
`
const GET_WEEK = `
	SELECT * FROM ${table}
	WHERE start > date_sub(now(), interval 1 week)
`

const GET_FORTNIGHT = `
	SELECT * FROM ${table}
	WHERE start > date_sub(now(), interval 2 week)
`

const GET_MONTH = `
	SELECT * FROM ${table}
	WHERE start > date_sub(now(), interval 1 month)
`

const GET_YEAR = `
	SELECT * FROM ${table}
	WHERE start > date_sub(now(), interval 1 year)
`

const queryMap: Record<TPeriod, string> = {
   week: GET_WEEK,
   fortnight: GET_FORTNIGHT,
   month: GET_MONTH,
   year: GET_YEAR,
   all: GET_ALL,
}

const getEntries = async (
   event: APIGatewayProxyEvent,
   pool: Pool,
): Promise<APIGatewayProxyResult> => {
   const period: TPeriod | undefined = event.queryStringParameters?.period as TPeriod
   try {
      let data
      if (period && period in queryMap) {
         const [rows] = await pool.query(queryMap[period])
         data = rows
      } else {
         const [rows] = await pool.query(GET_MONTH)
         data = rows
      }
      return buildHttpResponse(200, data)
   } catch (err) {
      console.error("Error fetching data: ", err)
      return buildHttpResponse(500, "Error fetching time entries")
   }
}

export { getEntries }
