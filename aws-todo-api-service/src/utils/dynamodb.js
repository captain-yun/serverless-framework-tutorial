const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  ScanCommand
} = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);
const TableName = process.env.TODOS_TABLE;

const dynamodb = {
  put: (Item) => docClient.send(new PutCommand({ TableName, Item })),
  get: (id) => docClient.send(new GetCommand({ 
    TableName, 
    Key: { id } 
  })),
  delete: (id) => docClient.send(new DeleteCommand({ 
    TableName, 
    Key: { id } 
  })),
  update: (id, data) => docClient.send(new UpdateCommand({
    TableName,
    Key: { id },
    UpdateExpression: 'set #title = :title, #completed = :completed',
    ExpressionAttributeNames: {
      '#title': 'title',
      '#completed': 'completed'
    },
    ExpressionAttributeValues: {
      ':title': data.title,
      ':completed': data.completed
    },
    ReturnValues: 'ALL_NEW'
  })),
  scan: () => docClient.send(new ScanCommand({ TableName }))
};

module.exports = dynamodb;