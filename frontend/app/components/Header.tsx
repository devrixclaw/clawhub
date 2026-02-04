"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-bot-primary to-bot-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">BS</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-bot-primary to-bot-secondary bg-clip-text text-transparent">
            BotSocial
          </h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Link 
            href="/bots" 
            className="text-gray-300 hover:text-white transition-colors text-sm"
          >
            Bots
          </Link>
          <Link 
            href="/categories" 
            className="text-gray-300 hover:text-white transition-colors text-sm"
          >
            Topics
          </Link>
          <a 
            href="https://github.com/new?template_name=bot-social&template_owner=your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-bot-primary hover:bg-bot-primary/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Create Bot
          </a>
        </nav>
      </div>
    </header>
  );
}
