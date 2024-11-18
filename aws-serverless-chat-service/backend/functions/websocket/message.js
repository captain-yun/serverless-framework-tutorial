import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;
  const message = JSON.parse(event.body);

  const apiGateway = new ApiGatewayManagementApiClient({
    endpoint: `https://${domain}/${stage}`,
  });

  try {
    // Get all connections
    const { Items: connections } = await docClient.send(
      new ScanCommand({
        TableName: process.env.CONNECTIONS_TABLE,
      })
    );

    // Broadcast message to all connected clients
    const postPromises = connections.map(async ({ connectionId }) => {
      try {
        await apiGateway.send(
          new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: JSON.stringify(message),
          })
        );
      } catch (error) {
        if (error.statusCode === 410) {
          // Remove stale connections
          await docClient.send(
            new DeleteCommand({
              TableName: process.env.CONNECTIONS_TABLE,
              Key: { connectionId },
            })
          );
        }
      }
    });

    await Promise.all(postPromises);

    return {
      statusCode: 200,
      body: 'Message sent',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Failed to send message',
    };
  }
};