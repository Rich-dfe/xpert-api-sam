import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as customerService from "../../services/customerService";
import { notFound, ok, badRequest, internalError } from "../../lib/responses";
import { getRequestContext } from "../../lib/requestContext";


export async function lambdaHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>{
    try{
        const context = await getRequestContext(event);
        const customers = await customerService.listCustomers(context);
        return ok(customers);
    }catch{
        return internalError("Something went wrong");
    }
}