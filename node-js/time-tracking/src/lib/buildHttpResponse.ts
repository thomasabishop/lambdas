import { APIGatewayProxyResult } from "aws-lambda"

const buildHttpResponse = (statusCode: number, body: any): APIGatewayProxyResult => {
   return {
      statusCode: statusCode,
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: body }),
   }
}

export { buildHttpResponse }
