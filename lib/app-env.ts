export type AppEnvironment = "production" | "preview" | "development";

export function appEnvironment(): AppEnvironment {
  if (process.env.VERCEL_ENV === "production") return "production";
  if (process.env.VERCEL_ENV === "preview") return "preview";
  if (process.env.VERCEL_ENV === "development") return "development";
  const explicit = process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV;
  if (explicit === "production" || explicit === "preview" || explicit === "development") {
    return explicit;
  }
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

export function isProductionApp() {
  return appEnvironment() === "production";
}

export function demoToolsEnabled() {
  if (isProductionApp()) return false;
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_TOOLS === "1" || appEnvironment() === "preview" || appEnvironment() === "development";
}
