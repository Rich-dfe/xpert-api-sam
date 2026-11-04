import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as chartDataService from "../../services/chartDataService";
import * as loggerAuthorizationService from "../../services/loggerAuthorizationService";

import { getRequestContext } from "../../lib/requestContext";
import { ok, badRequest,internalError } from "../../lib/responses";

export async function lambdaHandler(
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult>{
    try{
        const context = await getRequestContext(event);

        const loggerUid = event.pathParameters?.lid;
        const typeId = event.pathParameters?.tid;

        const startDate = Number(event.queryStringParameters?.startDate);
        const endDate = Number(event.queryStringParameters?.endDate);

        if(!loggerUid || !typeId){
            return badRequest("Missing logger identitiies");
        }

        if (
            !Number.isSafeInteger(startDate) ||
            !Number.isSafeInteger(endDate)
        ) {
            return badRequest("Invalid date range.");
        }

        // Check user authorisation
        const isAuthorized =
            await loggerAuthorizationService.getloggerAuthorization(
            loggerUid,
            context,
        );

        if (!isAuthorized) {
            return badRequest("Unauthorized action.");
        }

        //Fetch chart data
        const result = await chartDataService.getLoggerChartData(
            loggerUid,
            Number(typeId),
            startDate,
            endDate
        );

        if(result.success === false){
            return badRequest(result.message ?? "Unable to retrieve chart data");
        }

        return ok(result);

    }catch(error){
        console.error("CHART DATA HANDLER ERROR:", error);
        return internalError("Something went wrong");
    }
}