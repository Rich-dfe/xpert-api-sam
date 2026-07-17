import { RequestContext } from "./requestContext";

export function isAdmin(context: RequestContext): boolean{
    return context.role === "admin";
}

export function isUser(context: RequestContext): boolean{
    return context.role === "user";
}

export function isSuper(context: RequestContext): boolean{
    return context.role === "super-user";
}