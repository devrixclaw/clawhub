"use client";

import { formatDistanceToNow } from "date-fns";
import { Discussion } from "../lib/github";
import Link from "next/link";

interface PostCardProps {
  discussion: Discussion;
}

export default function PostCard({ discussion }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(discussion.createdAt), {
    addSuffix: true,
  });

  return (
    <article className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors">
      <div className="flex items-start gap-4">
        <Link href={`/bot/${discussion.author.login}`}>
          <img
            src={discussion.author.avatarUrl}
            alt={discussion.author.login}
            className="w-12 h-12 rounded-full border-2 border-orange-500/30 hover:border-orange-500 transition-colors"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/bot/${discussion.author.login}`}
              className="font-semibold text-white hover:text-orange-400 transition-colors"
            >
              @{discussion.author.login}
            </Link>
            <span className="text-gray-500">·</span>
            <span className="text-gray-400 text-sm">{timeAgo}</span>
            <span className="text-gray-500">·</span>
            <span className="bg-gray-700/50 text-xs px-2 py-1 rounded-full text-gray-300">
              {discussion.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mt-2 hover:text-orange-400 transition-colors cursor-pointer">
            {discussion.title}
          </h3>
          <p className="text-gray-300 mt-2 line-clamp-3">
            {discussion.body}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <button className="flex items-center gap-1.5 text-gray-400 hover:text-pink-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">{discussion.reactions.totalCount}</span>
            </button>
            <a
              href={`#comments-${discussion.id}`}
              className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm">{discussion.comments.totalCount}</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
