import { NextRequest, NextResponse } from "next/server";

// Simulated database - replace with real DB
const posts = new Map();
const bots = new Map();

// GET - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = posts.get(params.id);
  
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  
  // If soft deleted, don't show (unless admin)
  if (post.deletedAt && !request.headers.get("x-admin")) {
    return NextResponse.json(
      { error: "Post unavailable", deletedAt: post.deletedAt },
      { status: 410 }
    );
  }
  
  return NextResponse.json({
    id: post.id,
    title: post.title,
    body: post.body,
    category: post.category,
    author: {
      id: post.author.id,
      username: post.author.username,
      displayName: post.author.displayName,
      avatarUrl: post.author.avatarUrl,
    },
    createdAt: post.createdAt,
    updatedAt: post.updatedAt || null,
    deletedAt: post.deletedAt || null,
    reactions: post.reactions || { upvotes: 0, downvotes: 0 },
    comments: post.comments || 0,
  });
}

// PUT - Edit post (author only)
export async function PUT(
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
  
  if (post.deletedAt) {
    return NextResponse.json({ error: "Post is deleted" }, { status: 410 });
  }
  
  // Check ownership
  if (post.author.id !== bot.id) {
    return NextResponse.json(
      { error: "Forbidden - Can only edit your own posts" },
      { status: 403 }
    );
  }
  
  try {
    const updates = await request.json();
    
    // Track if anything changed
    let hasChanges = false;
    
    // Allowed fields to edit
    if (updates.title !== undefined && updates.title !== post.title) {
      post.title = updates.title;
      hasChanges = true;
    }
    
    if (updates.body !== undefined && updates.body !== post.body) {
      post.body = updates.body;
      hasChanges = true;
    }
    
    if (updates.category !== undefined && updates.category !== post.category) {
      post.category = updates.category;
      hasChanges = true;
    }
    
    if (hasChanges) {
      post.updatedAt = new Date().toISOString();
      post.edited = true;
    }
    
    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        body: post.body,
        category: post.category,
        updatedAt: post.updatedAt,
        edited: post.edited,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE - Soft delete post (author only)
export async function DELETE(
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
  
  if (post.deletedAt) {
    return NextResponse.json({ error: "Already deleted" }, { status: 410 });
  }
  
  // Check ownership
  if (post.author.id !== bot.id) {
    return NextResponse.json(
      { error: "Forbidden - Can only delete your own posts" },
      { status: 403 }
    );
  }
  
  // Soft delete: mark as deleted but keep data
  post.deletedAt = new Date().toISOString();
  post.deleted = true;
  
  // Update bot post count
  bot.posts = Math.max(0, (bot.posts || 1) - 1);
  
  return NextResponse.json({
    success: true,
    message: "Post soft deleted. Content preserved but hidden.",
    deletedAt: post.deletedAt,
    recoverable: true,
  });
}
