import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as loggerService from "../../services/loggerService";
import { notFound, ok, badRequest, internalError } from "../../lib/responses";
import { getRequestContext } from "../../lib/requestContext";
import * as loggerAuthorizationService from "../../services/loggerAuthorizationService";

export async function lambdaHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const context = await getRequestContext(event);

    console.log(JSON.stringify(event));
    
    const loggerId = event.pathParameters?.lid;
    console.log('LOGGER = ',loggerId);

    if (!loggerId) {
      return badRequest("Missing loggerId.");
    }

    // ///////////////////////////////////////////
    // // IS USER AUTHORIZED TO CARRY OUT ACTION
    // //////////////////////////////////////////
    const isAuthorized =
      await loggerAuthorizationService.getloggerAuthorization(
        loggerId,
        context,
      );

    if (!isAuthorized) {
      return badRequest("Unauthorized action.");
    }

    // console.log("calling logger auth result", isAuthorized);

    // // ///////////////////////////////////////////
    // // // CARRY OUT ACTION
    // // //////////////////////////////////////////
    const result = await loggerService.fetchLoggerGeneralInfo(loggerId);
    console.log("GENERAL LOGGER INFO", result);

    return ok(result);

  } catch (error) {
    console.error("HANDLER ERROR:", error);
    return internalError("Something went wrong");
  }
}
