import { getDiscussions } from "@/app/lib/github";
import { NextResponse } from "next/server";

export const runtime = 'edge';
export const revalidate = 60;

export async function GET() {
  try {
    const discussions = await getDiscussions();
    return NextResponse.json({ discussions });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}
