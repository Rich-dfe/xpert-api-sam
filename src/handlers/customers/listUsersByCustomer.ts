import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as customerService from "../../services/customerService";
import { notFound, ok, badRequest, internalError } from "../../lib/responses";
import { getRequestContext } from "../../lib/requestContext";

export async function lambdaHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const context = await getRequestContext(event);
    const custId = event.pathParameters?.id;

    if (!custId) {
      return badRequest("Missing customerId.");
    }

    const users = await customerService.listUsersByCustomer(
      custId,
      context,
    );
    return ok(users);
  } catch {
    return internalError("Something went wrong");
  }
}
