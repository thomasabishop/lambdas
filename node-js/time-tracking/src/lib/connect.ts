import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

const { AWS_SAM_LOCAL, DB_ENDPOINT, ACCESS_KEY, SECRET_KEY } = process.env
const isLocal = AWS_SAM_LOCAL === "true"

const client = new DynamoDBClient({
   region: isLocal ? "localhost" : "eu-west-2",
   endpoint: DB_ENDPOINT,
   credentials: {
      accessKeyId: ACCESS_KEY as string,
      secretAccessKey: SECRET_KEY as string,
   },
})

export { client }
