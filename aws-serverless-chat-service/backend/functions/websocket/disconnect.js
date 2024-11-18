import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const connectionId = event.requestContext.connectionId;

  try {
    await docClient.send(
      new DeleteCommand({
        TableName: process.env.CONNECTIONS_TABLE,
        Key: {
          connectionId,
        },
      })
    );

    return {
      statusCode: 200,
      body: 'Disconnected',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Failed to disconnect',
    };
  }
};