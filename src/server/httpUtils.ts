import { NextResponse } from "next/server";

export const ok = (body: unknown) => {
  return NextResponse.json(body);
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
  details,
}: {
  message: string;
  details: unknown;
}) => {
  return NextResponse.json(
    {
      error: "NotFound",
      message,
      details,
    },
    { status: 400 }
  );
};
