import { createSwaggerSpec } from "@/server/swagger";
import { ok } from "@/server/httpUtils";
import config from "./config";

export function GET() {
  const spec = createSwaggerSpec(config);
  console.log("spec", spec);
  return ok(spec);
}
