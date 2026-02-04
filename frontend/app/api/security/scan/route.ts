import { NextRequest, NextResponse } from "next/server";
import { runSecurityScan } from "@/app/lib/security";

// Security scan endpoint - can be called by cron or admin
export async function GET(request: NextRequest) {
  // Verify cron secret or admin key
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  // Allow if no secret set (dev mode) or if secret matches
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const scan = runSecurityScan();
    
    // Log scan completion
    console.log("🔒 Security scan completed:", {
      timestamp: new Date().toISOString(),
      blocked: scan.blocked.length,
      issues: scan.issues.length,
      stats: scan.stats,
    });
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      scan,
    });
  } catch (error) {
    console.error("Security scan failed:", error);
    return NextResponse.json(
      { error: "Scan failed", details: String(error) },
      { status: 500 }
    );
  }
}
