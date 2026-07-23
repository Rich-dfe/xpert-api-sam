import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as customerService from "../../services/customerService";
import { notFound, ok, badRequest, internalError } from "../../lib/responses";
import { getRequestContext } from "../../lib/requestContext";

export async function lambdaHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    
    const context = await getRequestContext(event);
    console.log('IM IN THE HANDLER!', event);
    const custId = event.pathParameters?.cid;

    if (!custId) {
      return badRequest("Missing customerId.");
    }

    const users = await customerService.listUsersByCustomer(
      custId,
      context,
    );
    return ok(users);
  } catch(error) {
    console.error("HANDLER ERROR:", error);
    return internalError("Something went wrong");
  }
}
