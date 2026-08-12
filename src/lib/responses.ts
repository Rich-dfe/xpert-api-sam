import { APIGatewayProxyResult } from "aws-lambda";

const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

export function ok(data: unknown): APIGatewayProxyResult {
  return {
    statusCode: 200,
    headers: defaultHeaders,
    body: JSON.stringify(data),
  };
}

export function created(data: unknown): APIGatewayProxyResult {
  return {
    statusCode: 201,
    headers: defaultHeaders,
    body: JSON.stringify(data),
  };
}

export function badRequest(message: string): APIGatewayProxyResult {
  return {
    statusCode: 400,
    headers: defaultHeaders,
    body: JSON.stringify({ message }),
  };
}

export function unauthorized(message = "Unauthorized"): APIGatewayProxyResult {
  return {
    statusCode: 401,
    headers: defaultHeaders,
    body: JSON.stringify({ message }),
  };
}

export function forbidden(message = "Forbidden"): APIGatewayProxyResult {
  return {
    statusCode: 403,
    headers: defaultHeaders,
    body: JSON.stringify({ message }),
  };
}

export function notFound(message = "Not Found"): APIGatewayProxyResult {
  return {
    statusCode: 404,
    headers: defaultHeaders,
    body: JSON.stringify({ message }),
  };
}

export function internalError(message = "Internal Server Error"): APIGatewayProxyResult {
  return {
    statusCode: 500,
    headers: defaultHeaders,
    body: JSON.stringify({ message }),
  };
}