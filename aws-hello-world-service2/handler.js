'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// DynamoDB Local 설정
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DUMMYIDEXAMPLE',
  secretAccessKey: 'DUMMYEXAMPLEKEY',
  credentials: {
    accessKeyId: 'DUMMYIDEXAMPLE',
    secretAccessKey: 'DUMMYEXAMPLEKEY'
  }
});

// 테이블 생성 함수
const createTableIfNotExists = async () => {
  const dynamoDB = new AWS.DynamoDB({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DUMMYIDEXAMPLE',
    secretAccessKey: 'DUMMYEXAMPLEKEY',
    credentials: {
      accessKeyId: 'DUMMYIDEXAMPLE',
      secretAccessKey: 'DUMMYEXAMPLEKEY'
    }
  });

  const params = {
    TableName: process.env.MESSAGES_TABLE,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    await dynamoDB.createTable(params).promise();
    console.log('Table created successfully');
  } catch (error) {
    if (error.code !== 'ResourceInUseException') {
      console.error('Error creating table:', error);
    }
  }
};

// 테이블 생성 실행
createTableIfNotExists();

// GET /hello - 저장된 메시지와 함께 Hello 응답
module.exports.hello = async (event) => {
  try {
    const params = {
      TableName: process.env.MESSAGES_TABLE
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
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};

// POST /message - 새 메시지 저장
module.exports.saveMessage = async (event) => {
  try {
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
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};