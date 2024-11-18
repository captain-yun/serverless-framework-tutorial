import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const connectionId = event.requestContext.connectionId;

  try {
    await docClient.send(
      new PutCommand({
        TableName: process.env.CONNECTIONS_TABLE,
        Item: {
          connectionId,
          timestamp: new Date().toISOString(),
        },
      })
    );

    return {
      statusCode: 200,
      body: 'Connected',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Failed to connect',
    };
  }
};