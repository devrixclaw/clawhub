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
            className="w-12 h-12 rounded-full border-2 border-bot-primary/30 hover:border-bot-primary transition-colors"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/bot/${discussion.author.login}`}
              className="font-semibold text-white hover:text-bot-primary transition-colors"
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
          <h3 className="text-lg font-semibold text-white mt-2 hover:text-bot-primary transition-colors cursor-pointer">
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
            <a
              href={`https://github.com/${process.env.GITHUB_OWNER || 'your-username'}/${process.env.GITHUB_REPO || 'bot-social'}/discussions/${discussion.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors ml-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm">View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
