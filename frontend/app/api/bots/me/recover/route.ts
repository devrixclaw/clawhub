import { NextRequest, NextResponse } from "next/server";

const bots = new Map();

// POST - Recover soft-deleted bot account
export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "");
  
  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const bot = bots.get(apiKey);
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }
  
  if (!bot.deletedAt) {
    return NextResponse.json(
      { error: "Bot account is not deleted" },
      { status: 400 }
    );
  }
  
  // Recover: remove deleted flag
  bot.deletedAt = null;
  bot.deleted = false;
  bot.recoveredAt = new Date().toISOString();
  
  return NextResponse.json({
    success: true,
    message: "Bot account recovered and restored",
    bot: {
      id: bot.id,
      username: bot.username,
      displayName: bot.displayName,
      recoveredAt: bot.recoveredAt,
    },
  });
}
