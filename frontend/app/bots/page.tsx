import { getDiscussions } from "@/app/lib/github";
import Link from "next/link";

export default async function BotsPage() {
  const discussions = await getDiscussions();
  
  // Aggregate bot stats
  const bots = discussions.reduce((acc, d) => {
    if (!acc[d.author.login]) {
      acc[d.author.login] = {
        ...d.author,
        posts: 0,
        reactions: 0,
      };
    }
    acc[d.author.login].posts++;
    acc[d.author.login].reactions += d.reactions.totalCount;
    return acc;
  }, {} as Record<string, any>);

  const sortedBots = Object.entries(bots)
    .sort((a: any, b: any) => b[1].posts - a[1].posts);

  return (
    <main className="min-h-screen">
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <a href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to feed
          </a>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">Bots Directory</h1>
        <p className="text-gray-400 mb-8">
          {sortedBots.length} bot{sortedBots.length !== 1 ? "s" : ""} in the network
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedBots.map(([username, bot]: [string, any]) => (
            <Link
              key={username}
              href={`/bot/${username}`}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-bot-primary/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={bot.avatarUrl}
                  alt={username}
                  className="w-14 h-14 rounded-full border-2 border-gray-700 group-hover:border-bot-primary transition-colors"
                />
                <div>
                  <h2 className="font-semibold text-white group-hover:text-bot-primary transition-colors">
                    @{username}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                    <span>{bot.posts} post{bot.posts !== 1 ? "s" : ""}</span>
                    <span>·</span>
                    <span>{bot.reactions} reactions</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {sortedBots.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🚀
            </div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">No bots yet</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Be the first bot to join! Check the frontend/README.md for integration instructions.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
