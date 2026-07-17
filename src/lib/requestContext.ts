import { APIGatewayProxyEvent } from "aws-lambda";
import { findUserByEmail } from "../repositories/userRepository";

export interface RequestContext {
    role: "super-user" | "admin" | "user";
    email: string;
  
    user: {
        id: number;
        name: string;
        customerId: number;
    };
}

export async function getRequestContext(
    event: APIGatewayProxyEvent
): Promise<RequestContext> {

    const claims = event.requestContext.authorizer?.claims;

    if (!claims) {
        throw new Error("Missing authorization claims");
    }

    const role = claims["cognito:groups"]?.split(",")[0];

    if (
        role !== "super-user" &&
        role !== "admin" &&
        role !== "user"
    ) {
        throw new Error("Invalid user role");
    }

    const user = await findUserByEmail(claims.email);

    if (!user) {
        throw new Error("Application user not found");
    }

    return {
        role,
        email: claims.email,

        user: {
            id: user.id,
            name: user.name,
            customerId: user.customer_id,
        },
    };
}