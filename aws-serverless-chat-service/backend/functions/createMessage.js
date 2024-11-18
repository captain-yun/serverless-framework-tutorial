import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const { body } = event;
    const data = JSON.parse(body);
    
    if (!data.message || !data.userId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'message and userId are required' }),
      };
    }

    const messageItem = {
      messageId: uuidv4(),
      createdAt: new Date().toISOString(),
      message: data.message,
      userId: data.userId,
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.MESSAGES_TABLE,
        Item: messageItem,
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(messageItem),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Could not create message' }),
    };
  }
};