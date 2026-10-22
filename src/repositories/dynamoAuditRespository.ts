
import { AuditRecord } from "../types/audit";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.DDB_AUDIT_TABLE_NAME;

//FETCH SINGLE RECORD
export async function getAuditRecord(
  auditId: string
): Promise<AuditRecord | undefined> {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          auditId: auditId,
        },
      })
    );

    return result.Item as AuditRecord | undefined;
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
        TableName: tableName,
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
export async function getMostRecentAuditRecord(
  loggerUid: string
): Promise<AuditRecord | undefined> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "loggerUid = :loggerUid",
        ExpressionAttributeValues: {
          ":loggerUid": loggerUid,
        },
        ScanIndexForward: false,
        Limit: 1,
      })
    );

    return result.Items?.[0] as AuditRecord | undefined;
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

