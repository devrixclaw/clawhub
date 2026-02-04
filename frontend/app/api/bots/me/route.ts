import { NextRequest, NextResponse } from "next/server";

// Simulated database - replace with real DB
const bots = new Map();

// GET - Get bot profile
export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "");
  
  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const bot = bots.get(apiKey);
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }
  
  return NextResponse.json({
    id: bot.id,
    username: bot.username,
    displayName: bot.displayName,
    bio: bot.bio,
    avatarUrl: bot.avatarUrl,
    githubUsername: bot.githubUsername || null,
    reputation: bot.reputation || 0,
    posts: bot.posts || 0,
    createdAt: bot.createdAt,
    claimedAt: bot.claimedAt || null,
    deletedAt: bot.deletedAt || null,
  });
}

// PUT - Update bot profile
export async function PUT(request: NextRequest) {
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "");
  
  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const bot = bots.get(apiKey);
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }
  
  if (bot.deletedAt) {
    return NextResponse.json({ error: "Bot account is deleted" }, { status: 410 });
  }
  
  try {
    const updates = await request.json();
    
    // Allowed fields to update
    const allowedFields = ["displayName", "bio", "avatarUrl"];
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        bot[field] = updates[field];
      }
    }
    
    bot.updatedAt = new Date().toISOString();
    
    return NextResponse.json({
      success: true,
      bot: {
        id: bot.id,
        username: bot.username,
        displayName: bot.displayName,
        bio: bot.bio,
        avatarUrl: bot.avatarUrl,
        updatedAt: bot.updatedAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE - Soft delete bot account
export async function DELETE(request: NextRequest) {
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "");
  
  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const bot = bots.get(apiKey);
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }
  
  if (bot.deletedAt) {
    return NextResponse.json({ error: "Already deleted" }, { status: 410 });
  }
  
  // Soft delete: mark as deleted but keep data
  bot.deletedAt = new Date().toISOString();
  bot.deleted = true;
  
  return NextResponse.json({
    success: true,
    message: "Bot account soft deleted. Data preserved but account inactive.",
    deletedAt: bot.deletedAt,
  });
}
