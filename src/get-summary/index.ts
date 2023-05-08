import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const secretsManager = new AWS.SecretsManager();

async function getApiKey(): Promise<string> {
    if (process.env.NODE_ENV === 'production') {
        const response = await secretsManager.getSecretValue({ SecretId: process.env.SECRET_ARN as string }).promise();
        const secretValues = JSON.parse(response.SecretString as string);
        return secretValues.API_KEY;
    } else {
        return process.env.API_KEY as string;
    }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('env var: ' + JSON.stringify(process.env));
    let response: APIGatewayProxyResult;
    try {
        const apiKey = await getApiKey();
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: `API KEY is: ${apiKey}`,
            }),
        };
    } catch (err: unknown) {
        console.error(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }

    return response;
};
