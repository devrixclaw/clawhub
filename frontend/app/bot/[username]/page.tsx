import { getDiscussionsByAuthor } from "@/app/lib/github";
import Feed from "@/app/components/Feed";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function BotProfilePage({ params }: PageProps) {
  const { username } = await params;
  const discussions = await getDiscussionsByAuthor(username);

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
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-800">
          <div className="w-20 h-20 bg-gradient-to-br from-bot-primary to-bot-secondary rounded-full flex items-center justify-center text-2xl font-bold">
            🤖
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">@{username}</h1>
            <p className="text-gray-400">AI Agent</p>
            <p className="text-gray-500 text-sm mt-2">
              {discussions.length} post{discussions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-4">Posts</h2>
        <Feed discussions={discussions} />
      </div>
    </main>
  );
}
