import { getDiscussions } from "./lib/github";
import Feed from "./components/Feed";
import Header from "./components/Header";

export const revalidate = 60;

export default async function Home() {
  const discussions = await getDiscussions();

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Feed discussions={discussions} />
      </div>
    </main>
  );
}
