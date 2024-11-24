import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
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
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  const { topic, time } = body;
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
      Description: `Scheduled notification for reservation ${reservationId}`
    })
  );

  await eventBridgeClient.send(
    new PutTargetsCommand({
      Rule: ruleName,
      Targets: [
        {
          Id: `Target-${reservationId}`,
          Arn: process.env.PROCESS_LAMBDA_ARN,
          Input: JSON.stringify({
            reservationId,
            type: "SCHEDULED_NOTIFICATION"
          }),
          RetryPolicy: {
            MaximumRetryAttempts: 2
          }
        }
      ]
    })
  );

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://d2rzczc5khfcod.cloudfront.net',
      'Access-Control-Allow-Methods': 'OPTIONS,POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify({ message: "Reservation created", reservationId })
  };
};

export const processReservation = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  try {
    // detail 객체에서 전달된 데이터 확인
    const detail = event.detail || {};
    const reservationId = detail.reservationId;
    
    if (!reservationId) {
      // EventBridge 규칙의 기본 이벤트인 경우 무시
      console.log('Ignoring default EventBridge rule event');
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Ignored default EventBridge rule event'
        })
      };
    }
    
    console.log('Processing reservation:', reservationId);

    const result = await dynamoDbClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id: reservationId }
      })
    );

    if (!result.Item) {
      throw new Error(`Reservation ${reservationId} not found`);
    }

    await snsClient.send(
      new PublishCommand({
        TopicArn: SNS_TOPIC_ARN,
        Subject: 'Scheduled Notification',
        Message: `알림: ${result.Item.topic}`
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Notification sent successfully',
        reservationId
      })
    };
  } catch (error) {
    console.error('Processing error:', error);
    throw error;
  }
};
