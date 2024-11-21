import { DynamoDBClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import {
  EventBridgeClient,
  PutRuleCommand,
  PutTargetsCommand,
} from "@aws-sdk/client-eventbridge";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { v4 as uuidv4 } from "uuid";

const dynamoDbClient = new DynamoDBClient({ region: "ap-northeast-2" });
const eventBridgeClient = new EventBridgeClient({ region: "ap-northeast-2" });
const snsClient = new SNSClient({ region: "ap-northeast-2" });

const TABLE_NAME = process.env.DYNAMODB_TABLE;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

export const createReservation = async (event) => {
  const { topic, time } = JSON.parse(event.body);
  const reservationId = uuidv4();

  // Save to DynamoDB
  await dynamoDbClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { id: reservationId, topic, time },
    })
  );

  // Schedule EventBridge Rule
  const ruleName = `Reservation-${reservationId}`;
  await eventBridgeClient.send(
    new PutRuleCommand({
      Name: ruleName,
      ScheduleExpression: `cron(${time})`,
      State: "ENABLED",
    })
  );

  await eventBridgeClient.send(
    new PutTargetsCommand({
      Rule: ruleName,
      Targets: [
        {
          Id: "processReservation",
          Arn: process.env.AWS_LAMBDA_FUNCTION_ARN,
          Input: JSON.stringify({ reservationId }),
        },
      ],
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Reservation created", reservationId }),
  };
};

export const processReservation = async (event) => {
  const { reservationId } = JSON.parse(event.detail);
  const result = await dynamoDbClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: reservationId },
    })
  );

  if (!result.Item) {
    throw new Error("Reservation not found");
  }

  // Send Notification
  await snsClient.send(
    new PublishCommand({
      TopicArn: SNS_TOPIC_ARN,
      Message: `Reminder: ${result.Item.topic}`,
    })
  );

  return { statusCode: 200, body: "Notification sent" };
};
