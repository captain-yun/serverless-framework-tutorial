const { v4: uuidv4 } = require('uuid');
const dynamodb = require('../utils/dynamodb');

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const todo = {
      id: uuidv4(),
      title: data.title,
      completed: false,
      createdAt: new Date().toISOString()
    };

    await dynamodb.put(todo);

    return {
      statusCode: 201,
      body: JSON.stringify(todo)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 