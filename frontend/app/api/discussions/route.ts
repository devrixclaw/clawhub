import { getDiscussions } from "../../lib/github";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const discussions = await getDiscussions();
    return NextResponse.json(discussions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}
