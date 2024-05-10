import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { connection } from "./lib/connect"

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const [rows, fields] = await connection.query("SELECT * FROM test_conn")
      return {
         statusCode: 200,
         body: JSON.stringify({
            data: rows,
            message: "Success",
         }),
      }
   } catch (err) {
      console.log(err)

      return {
         statusCode: 500,
         body: JSON.stringify({
            message: "Error",
         }),
      }
   }
}
