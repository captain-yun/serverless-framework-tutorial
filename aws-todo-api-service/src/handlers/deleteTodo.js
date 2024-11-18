const dynamodb = require('../utils/dynamodb');

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    await dynamodb.delete(id);
    
    return {
      statusCode: 204,
      body: ''
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};