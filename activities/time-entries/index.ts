import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { TogglClient } from "./helpers/TogglClient"
import { getProjects } from "./helpers/getProjects"

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // const togglClient = new TogglClient()
        // const testData = await togglClient.get("me/time_entries?start_date=2023-09-01&end_date=2023-09-22")
        // const projects = await getProjects()
        // const dummyProject = 193325926
        // const example = projects[dummyProject]
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "hello world",
            }),
        }
    } catch (err) {
        console.log(err)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "some error happened",
            }),
        }
    }
}
