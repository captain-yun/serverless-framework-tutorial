const dynamodb = require('../utils/dynamodb');

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const data = JSON.parse(event.body);
    
    const result = await dynamodb.update(id, data);

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};