import { HttpResponse, HttpStatusCode } from '../interfaces/http';
import { Presenter } from '../interfaces/presenter';
import { DomainError, ValidationError, NotFoundError, UnauthorizedError, ForbiddenError, ConflictError, UnprocessableEntityError } from '../interfaces/error';

export class HttpPresenter implements Presenter {
  success(data: any): HttpResponse {
    return {
      statusCode: HttpStatusCode.OK,
      body: data
    };
  }

  created(data: any): HttpResponse {
    return {
      statusCode: HttpStatusCode.CREATED,
      body: data
    };
  }

  noContent(): HttpResponse {
    return {
      statusCode: HttpStatusCode.NO_CONTENT
    };
  }

  forbidden(message: string = 'Acesso negado'): HttpResponse {
    return {
      statusCode: HttpStatusCode.FORBIDDEN,
      body: { error: message }
    };
  }

  conflict(message: string): HttpResponse {
    return {
      statusCode: HttpStatusCode.CONFLICT,
      body: { error: message }
    };
  }

  unprocessableEntity(message: string): HttpResponse {
    return {
      statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
      body: { error: message }
    };
  }

  error(error: Error): HttpResponse {
    console.error(error);

    if (error instanceof ValidationError) {
      return {
        statusCode: HttpStatusCode.BAD_REQUEST,
        body: { error: error.message }
      };
    }

    if (error instanceof NotFoundError) {
      return {
        statusCode: HttpStatusCode.NOT_FOUND,
        body: { error: error.message }
      };
    }

    if (error instanceof UnauthorizedError) {
      return {
        statusCode: HttpStatusCode.UNAUTHORIZED,
        body: { error: error.message }
      };
    }

    if (error instanceof ForbiddenError) {
      return {
        statusCode: HttpStatusCode.FORBIDDEN,
        body: { error: error.message }
      };
    }

    if (error instanceof ConflictError) {
      return {
        statusCode: HttpStatusCode.CONFLICT,
        body: { error: error.message }
      };
    }

    if (error instanceof UnprocessableEntityError) {
      return {
        statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
        body: { error: error.message }
      };
    }

    if (error instanceof DomainError) {
      return {
        statusCode: HttpStatusCode.BAD_REQUEST,
        body: { error: error.message }
      };
    }

    return {
      statusCode: HttpStatusCode.SERVER_ERROR,
      body: { error: 'Internal server error' }
    };
  }
} 