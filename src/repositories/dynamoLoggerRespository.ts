
import { AuditRecord } from "../types/audit";
import { LatestDiagnosticDatabaseResponse } from "../types/logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const diagnosticTableName = "odyDiagnostic";

//FETCH SINGLE RECORD
export async function getSingleDiagnosticData(
  auditId: string
): Promise<LatestDiagnosticDatabaseResponse> {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: diagnosticTableName,
        Key: {
          auditId: auditId,
        },
      })
    );

    return result.Item as LatestDiagnosticDatabaseResponse;
  } catch (error) {
    console.error("Failed to fetch audit record:", error);
    throw error;
  }
}

//FETCH MULTIPLE RECORDS
export async function getAuditRecordsByEntity(
  entityId: string
): Promise<AuditRecord[]> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: diagnosticTableName,
        KeyConditionExpression: "entityId = :entityId",
        ExpressionAttributeValues: {
          ":entityId": entityId,
        },
      })
    );

    return (result.Items ?? []) as AuditRecord[];
  } catch (error) {
    console.error("Failed to query audit records:", error);
    throw error;
  }
}

//FETCH MOST RECENT RECORD
export async function getMostRecentDiagnosticRecord(
  loggerUid: string
): Promise<LatestDiagnosticDatabaseResponse> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: diagnosticTableName,
        KeyConditionExpression: "loggerUid = :loggerUid",
        ExpressionAttributeValues: {
          ":loggerUid": loggerUid,
        },
        ScanIndexForward: false,
        Limit: 1,
      })
    );

    return result.Items?.[0] as LatestDiagnosticDatabaseResponse;
  } catch (error) {
    console.error("Failed to fetch most recent audit record:", error);
    throw error;
  }
}



// KeyConditionExpression:
//   "entityId = :entityId AND createdAt BETWEEN :start AND :end",

// ExpressionAttributeValues: {
//   ":entityId": entityId,
//   ":start": startDate,
//   ":end": endDate,

