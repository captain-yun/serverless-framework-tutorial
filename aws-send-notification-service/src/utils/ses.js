const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient();

const sendWelcomeEmail = async (email, userId) => {
  const params = {
    Source: process.env.SES_SENDER_EMAIL, // SES에서 인증된 이메일 주소
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "Welcome to Our Service!",
      },
      Body: {
        Text: {
          Data: `Hello ${userId}!\n\nWelcome to our service. We're glad to have you on board.`,
        },
      },
    },
  };

  try {
    await sesClient.send(new SendEmailCommand(params));
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
};
