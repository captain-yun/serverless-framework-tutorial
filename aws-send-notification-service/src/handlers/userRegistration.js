const { saveUser } = require('../utils/dynamodb');
const { sendWelcomeEmail } = require('../utils/ses');

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { userId, email } = body;

    if (!userId || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'userId and email are required'
        })
      };
    }

    // Save user to DynamoDB
    await saveUser(userId, email);

    // Send welcome email
    await sendWelcomeEmail(email, userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User registered successfully and welcome email sent!'
      })
    };
  } catch (error) {
    console.error('Error in user registration:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error'
      })
    };
  }
};

module.exports = {
  handler
};
