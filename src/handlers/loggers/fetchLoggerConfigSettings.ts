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

    if (!loggerId) {
      return badRequest("Missing loggerId.");
    }

    const loggerUid = await loggerService.fetchLoggerUidByLoggerId(loggerId);
      console.log('LOGGER UID',loggerUid);

    if (!loggerUid) {
      return badRequest("Logger UID not found.");
    }

    ///////////////////////////////////////////
    // IS USER AUTHORIZED TO CARRY OUT ACTION
    //////////////////////////////////////////
    const isAuthorized =
      await loggerAuthorizationService.getloggerAuthorization(
        loggerUid,
        context,
      );

    if (!isAuthorized) {
      return badRequest("Unauthorized action.");
    }

    console.log("calling logger auth result", isAuthorized);

    ///////////////////////////////////////////
    // CARRY OUT ACTION
    //////////////////////////////////////////
    const result = await loggerService.fetchLoggerConfigSettings(loggerId);
    console.log("CONFIG SETTINGS", result);

    return ok(result);

    //These numbers represent the affected rows from the SQL queries
    // if (result == 2 && etagResult == 1) {
    //   return ok(result);
    // } else {
    //   return internalError("Config Settings Save Error!");
    // }
  } catch (error) {
    console.error("HANDLER ERROR:", error);
    return internalError("Something went wrong");
  }
}
