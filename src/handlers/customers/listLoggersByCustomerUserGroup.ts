import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as customerService from "../../services/customerService";
import { notFound, ok, badRequest, internalError } from "../../lib/responses";
import { getRequestContext } from "../../lib/requestContext";
import { json } from "node:stream/consumers";

export async function lambdaHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    console.log(JSON.stringify(event));
    //const context = await getRequestContext(event);
    const custId = event.pathParameters?.cid;
    const userId = event.pathParameters?.uid;
    const groupId = event.pathParameters?.gid;

    console.log("##### VARS", custId, userId, groupId);

    if (!custId || !userId || !groupId) {
      return badRequest("Missing path parameters.");
    }

    const loggers = await customerService.listLoggersByCustomerUserGroup(
      custId,
      userId,
      groupId
    );
    return ok(loggers);
  } catch(error) {
    console.error('ERRROR',error);
    return internalError("Something went wrong");
  }
}
