import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log({ url: req.url, method: req.method, body: req.body });
  return NextResponse.next();
}
