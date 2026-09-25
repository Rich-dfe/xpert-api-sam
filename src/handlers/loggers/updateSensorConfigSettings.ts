import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as loggerService from "../../services/loggerService";
import { notFound, ok, badRequest, internalError } from "../../lib/responses";
import { getRequestContext } from "../../lib/requestContext";
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

    const sensorSetting = Number(body.sensorSetting);
    const typeId = String(body.typeId);
    const loggerId = Number(body.loggerId);
    const loggerUid = body.loggerUid;

    //////////////////////////////////////////
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

    const result = await loggerService.updateSensorConfigSettings(loggerId,typeId,sensorSetting);
    console.log('DB RESULT',result);

    // ///////////////////////////////////////////
    // // UPDATE ETAG
    // //////////////////////////////////////////
    const etagResult = await loggerService.updateEtag(body.loggerId);
    console.log('ETAG RESULT', etagResult);
    
    ///////////////////////////////////////////
    // UPDATE SERVER SETTINGS VERSION
    //////////////////////////////////////////
    const settingsServerVersionResult = await loggerService.updateServerSettingsVersion(body.loggerId);
    console.log("SERVER SETTINGS UPDATE RESULT", settingsServerVersionResult);

    // ///////////////////////////////////////////
    // // UPDATE AUDIT TRAIL WITH ACTION
    // //////////////////////////////////////////
    await auditService.writeAudit({
      loggerUid: body.loggerUid,
      userId: context.user.id.toString(),
      action: "SENSOR CONFIG UPDATE",
      resource: "sensor_config",
      resourceId: body.loggerId,
      data: body,
    });

    //These numbers represent the affected rows from the SQL queries 
    if (result == 1 && etagResult == 1) {
      return ok(result);
    } else {
      return internalError("Config Settings Save Error!");
    }
  } catch (error) {
    console.error("HANDLER ERROR:", error);
    return internalError("Something went wrong");
  }
}
