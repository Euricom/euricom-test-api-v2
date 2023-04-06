import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const ok = (body: unknown, statusCode?: number) => {
  return NextResponse.json(body, { status: statusCode || 200 });
};

export const conflict = (code: string, message: string) => {
  return NextResponse.json(
    {
      error: "Conflict",
      code,
      message,
    },
    { status: 409 }
  );
};

export const internalServerError = ({
  message,
  details,
}: {
  message: string;
  details?: unknown;
}) => {
  return NextResponse.json(
    {
      error: "InternalServerError",
      message,
      details,
    },
    { status: 500 }
  );
};

export const notFound = (message: string) => {
  return NextResponse.json(
    {
      error: "NotFound",
      message,
    },
    { status: 404 }
  );
};

export const noContent = () => {
  return new Response(null, {
    status: 204,
  });
};

export const badRequest = ({
  message,
  errors,
}: {
  message: string;
  errors?: unknown;
}) => {
  return NextResponse.json(
    {
      error: "BadRequest",
      message,
      errors,
    },
    { status: 404 }
  );
};

export class NotFoundError extends Error {
  constructor(message = "The resource is not found") {
    super(message);
  }
}

export class BadRequestError extends Error {
  errors?: unknown;
  constructor(message: string, errors?: unknown) {
    super(message);
    this.errors = errors;
  }
}

export class ConflictError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const withErrorHandling = async (
  handler: () => Response | Promise<Response>
) => {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFound(error.message);
    }
    if (error instanceof ConflictError) {
      // custom bad request
      return conflict(error.code, error.message);
    }
    if (error instanceof BadRequestError) {
      // custom bad request
      return badRequest({ message: error.message, errors: error.errors });
    }
    if (error instanceof ZodError) {
      // a zod error is always a bad request
      const errors = error.issues.map((issue) => {
        return {
          key: issue.path[0],
          message: issue.message,
        };
      });
      return badRequest({
        message: "One or more fields are invalid",
        errors,
      });
    }
    if (error instanceof Error) {
      // if nothing else just return a 500
      return internalServerError({
        message: error.message,
        details: error.stack,
      });
    }
    throw error;
  }
};
