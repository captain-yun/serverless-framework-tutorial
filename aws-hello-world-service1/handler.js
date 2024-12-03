'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

// GET /hello - 저장된 메시지와 함께 Hello 응답
module.exports.hello = async (event) => {
  const params = {
    TableName: process.env.MESSAGES_TABLE,
  };

  const result = await dynamoDb.scan(params).promise();
  const messages = result.Items.map(item => item.message);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World!',
      savedMessages: messages
    })
  };
};

// POST /message - 새 메시지 저장
module.exports.saveMessage = async (event) => {
  const { message } = JSON.parse(event.body);
  
  const params = {
    TableName: process.env.MESSAGES_TABLE,
    Item: {
      id: uuidv4(),
      message: message,
      timestamp: new Date().toISOString()
    }
  };

  await dynamoDb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Message saved successfully'
    })
  };
};