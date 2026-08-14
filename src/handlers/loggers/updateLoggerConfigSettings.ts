import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as loggerService from "../../services/loggerService";
import { notFound, ok, badRequest, internalError } from "../../lib/responses";
import { getRequestContext } from "../../lib/requestContext";
import { request } from "node:http";
import * as auditService from "../../services/auditService";
import * as loggerAuthorizationService from "../../services/loggerAuthorizationService";

export async function lambdaHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const context = await getRequestContext(event);
    
    const body = JSON.parse(event.body ?? "");

    console.log("BODY", body);

    if (!body) {
      return badRequest("Missing body.");
    }

    ///////////////////////////////////////////
    // IS USER AUTHORIZED TO CARRY OUT ACTION
    //////////////////////////////////////////
    const isAuthorized =
      await loggerAuthorizationService.getloggerAuthorization(
        body.loggerUid,
        context,
      );

    console.log("calling logger auth result", isAuthorized);

    ///////////////////////////////////////////
    // CARRY OUT ACTION
    //////////////////////////////////////////

    if (!isAuthorized) {
      return badRequest("Unauthorized action.");
    }

    const result = await loggerService.updateLoggerConfigSettings(body);

    ///////////////////////////////////////////
    // UPDATE AUDIT TRAIL WITH ACTION
    //////////////////////////////////////////
    await auditService.writeAudit({
      loggerUid: body.loggerUid,
      userId: context.user.id.toString(),
      action: "UPDATE",
      resource: "logger_config",
      resourceId: body.loggerId,
      data: body,
    });

    if (result == 2) {
      return ok(result);
    } else {
      return internalError("Config Settings Save Error!");
    }
  } catch (error) {
    console.error("HANDLER ERROR:", error);
    return internalError("Something went wrong");
  }
}
