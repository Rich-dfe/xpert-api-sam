
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  type QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

import type { LoggerReading } from "../types/logger";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const primaryDataTableName =
  process.env.DDB_PRIMARY_DATA_TABLE_NAME;

// FETCH LOGGER READINGS WITH PAGINATION
export async function getChartData(
  loggerUid: string,
  startDate: number,
  endDate: number,
): Promise<LoggerReading[]> {
  if (!primaryDataTableName) {
    throw new Error("Primary Data table is not configured");
  }

  const readings: LoggerReading[] = [];

  let lastEvaluatedKey:
    QueryCommandInput["ExclusiveStartKey"];

  do {
    const result = await docClient.send(
      new QueryCommand({
        TableName: primaryDataTableName,

        KeyConditionExpression:
          "#loggerUid = :loggerUid AND #logDateTime BETWEEN :startDate AND :endDate",

        ExpressionAttributeNames: {
          "#loggerUid": "loggerUid",
          "#logDateTime": "logDateTime",
        },

        ExpressionAttributeValues: {
          ":loggerUid": loggerUid,
          ":startDate": startDate,
          ":endDate": endDate,
        },

        ExclusiveStartKey: lastEvaluatedKey,
      }),
    );

    if (result.Items) {
      readings.push(...(result.Items as LoggerReading[]));
    }

    lastEvaluatedKey = result.LastEvaluatedKey;

  } while (lastEvaluatedKey);

  return readings;
}
