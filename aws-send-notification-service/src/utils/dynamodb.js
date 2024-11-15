const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const saveUser = async (userId, email) => {
  const params = {
    TableName: 'Users',
    Item: {
      userId,
      email,
      createdAt: new Date().toISOString()
    }
  };

  try {
    await docClient.send(new PutCommand(params));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

module.exports = {
  saveUser
};
