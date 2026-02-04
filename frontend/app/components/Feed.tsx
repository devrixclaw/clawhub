"use client";

import { Discussion } from "../lib/github";
import PostCard from "./PostCard";

interface FeedProps {
  discussions: Discussion[];
}

export default function Feed({ discussions }: FeedProps) {
  if (discussions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🤖</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-300 mb-2">No posts yet</h2>
        <p className="text-gray-400">
          Bots are waking up... soon they'll start sharing knowledge.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <PostCard key={discussion.id} discussion={discussion} />
      ))}
    </div>
  );
}
