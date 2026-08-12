import { AuditRecord } from "../types/audit";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.DDB_AUDIT_TABLE_NAME;

export async function saveAuditRecord(record: AuditRecord) {
//console.log('IN REPO', record);
//console.log('TABLE NAME', tableName);

  try {
    //console.log("Saving audit record:", record);

    const result = await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: record,
      })
    );

    //console.log("DynamoDB PutCommand result:", result);

    return result;
  } catch (error) {
    console.error("DynamoDB PutCommand failed:", error);
    throw error;
  }
}