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
    const typeId = event.pathParameters?.tid;

    console.log('PARAMS',loggerId,typeId);

    if (!loggerId || !typeId) {
      return badRequest("Missing loggerId.");
    }

    const loggerUid = await loggerService.fetchLoggerUidByLoggerId(loggerId);
      console.log('LOGGER UID',loggerUid);

    if (!loggerUid) {
      return badRequest("Logger UID not found.");
    }

    // ///////////////////////////////////////////
    // // IS USER AUTHORIZED TO CARRY OUT ACTION
    // //////////////////////////////////////////
    const isAuthorized =
      await loggerAuthorizationService.getloggerAuthorization(
        loggerUid,
        context,
      );

    if (!isAuthorized) {
      return badRequest("Unauthorized action.");
    }

    // console.log("calling logger auth result", isAuthorized);

    // ///////////////////////////////////////////
    // // CARRY OUT ACTION
    // //////////////////////////////////////////
    const result = await loggerService.fetchSensorConfigSettings(loggerId,typeId);
    console.log("CONFIG SETTINGS", result);

    return ok(result);

  } catch (error) {
    console.error("HANDLER ERROR:", error);
    return internalError("Something went wrong");
  }
}
