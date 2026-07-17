import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as userService from "../../services/userService";
import { notFound, ok, badRequest, internalError } from "../../lib/responses";
import { getRequestContext } from "../../lib/requestContext";


export async function lambdaHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>{
    try{
        const context = await getRequestContext(event);
        const users = await userService.listUsers(context);
        return ok(users);
    }catch{
        return internalError("Something went wrong");
    }
}