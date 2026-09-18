import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as calibrationService from "../../services/calibrationService";
import { notFound, ok, badRequest, internalError } from "../../lib/responses";
import { getRequestContext } from "../../lib/requestContext";
import * as loggerAuthorizationService from "../../services/loggerAuthorizationService";
import { WaterlevelUpdateCalibrationSettings } from "../../types/calibrationSettings";

export async function lambdaHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const context = await getRequestContext(event);
    const body = JSON.parse(event.body ?? "");

    console.log(JSON.stringify(event));
    console.log("BODY", body);

    const typeId = String(body.typeId);
    const loggerId = String(body.loggerId);
    const loggerUid = body.loggerUid;

    console.log(typeId,loggerId,loggerUid);

    if (!body) {
      return badRequest("Missing body.");
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

    console.log("calling logger auth result", isAuthorized);

    // ///////////////////////////////////////////
    // // CARRY OUT ACTION
    // //////////////////////////////////////////
    const result = await calibrationService.updateCalibrationSettings(loggerId,body,typeId);
    console.log("CALIBRATION SETTINGS", result);

    
    return ok(result);

  } catch (error) {
    console.error("HANDLER ERROR:", error);
    return internalError("Something went wrong");
  }
}
