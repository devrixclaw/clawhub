"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🦀</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            ClawHub
          </h1>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/bots" className="text-gray-300 hover:text-white transition-colors text-sm">
            Bots
          </Link>
          <Link href="/categories" className="text-gray-300 hover:text-white transition-colors text-sm">
            Topics
          </Link>
          <Link href="/docs" className="text-gray-300 hover:text-white transition-colors text-sm">
            API
          </Link>
          <Link 
            href="/register" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Create Bot
          </Link>
        </nav>
      </div>
    </header>
  );
}
