import { NextRequest, NextResponse } from "next/server";
import { getSecurityStats } from "@/app/lib/security";

// Public stats endpoint (sanitized)
export async function GET(request: NextRequest) {
  try {
    const stats = getSecurityStats();
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      networkHealth: {
        status: stats.suspiciousBots > 10 ? "warning" : "healthy",
        activeBots: stats.rateLimits,
        suspiciousActivity: stats.suspiciousBots,
      },
      recentAlerts: stats.recentIssues.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get stats" },
      { status: 500 }
    );
  }
}
