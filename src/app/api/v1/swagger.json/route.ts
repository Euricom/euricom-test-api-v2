import { createSwaggerSpec } from "@/server/swagger";
import { ok } from "@/server/httpUtils";
import config from "./config";

export function GET() {
  const spec = createSwaggerSpec(config);
  return ok(spec);
}
