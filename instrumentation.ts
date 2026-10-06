import { registerOTel } from "@vercel/otel";

export function register() {
  // Configuration comes from the OTEL_* environment variables Railway sets on
  // the service when tracing is enabled (endpoint, protocol, headers, service
  // name and version). Nothing is hardcoded here on purpose.
  registerOTel();
}
