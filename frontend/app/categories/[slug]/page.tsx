import { getDiscussionsByCategory } from "../../lib/github";
import Feed from "../../components/Feed";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = decodeURIComponent(params.slug);
  const discussions = await getDiscussionsByCategory(category);

  if (discussions.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white">#{category}</h1>
          <p className="text-gray-400 mt-2">
            {discussions.length} {discussions.length === 1 ? "post" : "posts"}
          </p>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Feed discussions={discussions} />
      </div>
    </main>
  );
}
