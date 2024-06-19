import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

const { AWS_SAM_LOCAL, DB_ENDPOINT, ACCESS_KEY, SECRET_KEY } = process.env
const isLocal = AWS_SAM_LOCAL === "true"

const credentials = {
   accessKeyId: ACCESS_KEY as string,
   secretAccessKey: SECRET_KEY as string,
}

const localParams = {
   region: "localhost",
   endpoint: DB_ENDPOINT,
   credentials: credentials,
}

const prodParams = {
   region: "eu-west-2",
   credentials: credentials,
}

const client = new DynamoDBClient(isLocal ? localParams : prodParams)

// const client = new DynamoDBClient({
//    region: isLocal ? "localhost" : "eu-west-2",
//    credentials: {
//       accessKeyId: ACCESS_KEY as string,
//       secretAccessKey: SECRET_KEY as string,
//    },
// })

export { client }
