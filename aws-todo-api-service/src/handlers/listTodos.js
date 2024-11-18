const dynamodb = require('../utils/dynamodb');

exports.handler = async () => {
  try {
    const result = await dynamodb.scan();
    
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};