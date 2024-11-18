const dynamodb = require('../utils/dynamodb');

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const result = await dynamodb.get(id);
    
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Todo not found' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};