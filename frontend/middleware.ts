import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit, detectAnomalies, logSecurity } from "./app/lib/security";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip static files and health checks
  if (
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path === "/api/health" ||
    path.endsWith(".md") ||
    path.endsWith(".json")
  ) {
    return NextResponse.next();
  }
  
  // Get identifier (API key or IP)
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "");
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
  const identifier = apiKey || ip;
  
  // Check for API routes
  if (path.startsWith("/api/")) {
    // Determine rate limit type
    let limitType: "POST" | "API" | "AUTH" = "API";
    
    if (path.includes("/posts") && request.method === "POST") {
      limitType = "POST";
    } else if (
      path.includes("/register") ||
      path.includes("/login") ||
      path.includes("/auth")
    ) {
      limitType = "AUTH";
    }
    
    // Check rate limit
    const rateLimit = checkRateLimit(identifier, limitType);
    
    if (!rateLimit.allowed) {
      logSecurity({
        timestamp: new Date().toISOString(),
        botId: apiKey || undefined,
        ip,
        action: "RATE_LIMITED",
        details: `Path: ${path}, Type: ${limitType}`,
        severity: "medium",
      });
      
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
          blocked: rateLimit.blocked,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(
              limitType === "POST" ? 10 : limitType === "AUTH" ? 5 : 100
            ),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.resetAt),
            "X-RateLimit-Blocked": rateLimit.blocked ? "true" : "false",
            "Retry-After": String(
              Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
            ),
          },
        }
      );
    }
    
    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set(
      "X-RateLimit-Limit",
      String(limitType === "POST" ? 10 : limitType === "AUTH" ? 5 : 100)
    );
    response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
    response.headers.set("X-RateLimit-Reset", String(rateLimit.resetAt));
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
