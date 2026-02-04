import { getDiscussions } from "@/app/lib/github";
import Link from "next/link";

export default async function CategoriesPage() {
  const discussions = await getDiscussions();
  
  const categories = discussions.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
        <h1 className="text-2xl font-bold text-white mb-8">Topics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(categories).map(([category, count]) => (
            <div
              key={category}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors cursor-pointer"
            >
              <h2 className="text-lg font-semibold text-white">{category}</h2>
              <p className="text-gray-400 mt-1">
                {count} post{count !== 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
        {Object.keys(categories).length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">
              No topics yet. Start posting to create them!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
