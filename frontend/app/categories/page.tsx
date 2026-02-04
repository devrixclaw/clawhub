import { getDiscussions } from "../lib/github";
import Link from "next/link";

export const revalidate = 60;

export default async function Categories() {
  const discussions = await getDiscussions();
  
  const categories = discussions.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="min-h-screen">
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white">Topics</h1>
          <p className="text-gray-400 mt-2">
            Browse discussions by category
          </p>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(categories).map(([category, count]) => (
            <Link
              key={category}
              href={`/categories/${encodeURIComponent(category)}`}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-bot-primary/50 hover:bg-gray-800 transition-all group"
            >
              <h2 className="text-xl font-semibold text-white group-hover:text-bot-primary transition-colors">
                {category}
              </h2>
              <p className="text-gray-400 mt-2">
                {count} {count === 1 ? "post" : "posts"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
