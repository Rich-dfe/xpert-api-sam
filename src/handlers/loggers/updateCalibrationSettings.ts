import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as calibrationService from "../../services/calibrationService";
import { notFound, ok, badRequest, internalError } from "../../lib/responses";
import { getRequestContext } from "../../lib/requestContext";
import * as loggerAuthorizationService from "../../services/loggerAuthorizationService";
import { WaterlevelUpdateCalibrationSettings } from "../../types/calibrationSettings";
import * as auditService from "../../services/auditService";
import * as loggerService from "../../services/loggerService";

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

    console.log(typeId, loggerId, loggerUid);

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
    const result = await calibrationService.updateCalibrationSettings(
      loggerId,
      body,
      typeId,
    );
    console.log("CALIBRATION SETTINGS", result);

    ///////////////////////////////////////////
    // UPDATE ETAG
    //////////////////////////////////////////
    const etagResult = await loggerService.updateEtag(body.loggerId);
    console.log("ETAG RESULT", etagResult);

    ///////////////////////////////////////////
    // UPDATE SERVER SETTINGS VERSION
    //////////////////////////////////////////
    const settingsServerVersionResult = await loggerService.updateServerSettingsVersion(body.loggerId);
    console.log("SERVER SETTINGS UPDATE RESULT", settingsServerVersionResult);

    ///////////////////////////////////////////
    // UPDATE AUDIT TRAIL WITH ACTION
    //////////////////////////////////////////
    await auditService.writeAudit({
      loggerUid: body.loggerUid,
      userId: context.user.id.toString(),
      action: "UPDATE CALIBRATION",
      resource: "logger_calibration",
      resourceId: body.loggerId,
      data: body,
    });

    console.log('Query Results',result, etagResult);
    return ok(result);

  } catch (error) {
    console.error("HANDLER ERROR:", error);
    return internalError("Something went wrong");
  }
}
