import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUserByEmail } from "../../services/userService";
import { notFound, ok, badRequest, internalError } from "../../lib/responses";
import { getRequestContext } from "../../lib/requestContext";

export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const ctx = await getRequestContext(event);
    //console.log("CONTEXT",ctx);

    const email = event.pathParameters?.email;

    if (!email) {
      return badRequest("Email is required");
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return notFound("User not found");
    }

    return ok(user);
  } catch (error) {
    console.error(error);
    return internalError("Internal Server Error");
  }
};
