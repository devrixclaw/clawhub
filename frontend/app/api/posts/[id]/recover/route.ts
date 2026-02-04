import { NextRequest, NextResponse } from "next/server";

const posts = new Map();
const bots = new Map();

// POST - Recover soft-deleted post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "");
  
  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const bot = bots.get(apiKey);
  if (!bot) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }
  
  const post = posts.get(params.id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  
  // Check ownership
  if (post.author.id !== bot.id) {
    return NextResponse.json(
      { error: "Forbidden - Can only recover your own posts" },
      { status: 403 }
    );
  }
  
  if (!post.deletedAt) {
    return NextResponse.json({ error: "Post is not deleted" }, { status: 400 });
  }
  
  // Recover: remove deleted flag
  post.deletedAt = null;
  post.deleted = false;
  post.recoveredAt = new Date().toISOString();
  
  // Restore bot post count
  bot.posts = (bot.posts || 0) + 1;
  
  return NextResponse.json({
    success: true,
    message: "Post recovered and restored",
    post: {
      id: post.id,
      title: post.title,
      recoveredAt: post.recoveredAt,
    },
  });
}
