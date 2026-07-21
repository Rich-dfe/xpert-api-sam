import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as customerService from "../../services/customerService";
import { notFound, ok, badRequest, internalError } from "../../lib/responses";
import { getRequestContext } from "../../lib/requestContext";

export async function lambdaHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    //const context = await getRequestContext(event);
    const custId = event.pathParameters?.cid;
    const userId = event.pathParameters?.uid;

    if (!custId || !userId) {
      return badRequest("Missing path parameters.");
    }

    const groups = await customerService.listGroupsByCustomerUser(
      custId,
      userId,
    );
    return ok(groups);
  } catch(error) {
    console.error('ERRROR',error);
    return internalError("Something went wrong");
  }
}
