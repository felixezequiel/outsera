export interface HttpRequest {
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
  user?: any; // para autenticação
}

export interface HttpResponse {
  statusCode: HttpStatusCode;
  body?: any;
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  SERVER_ERROR = 500
} 