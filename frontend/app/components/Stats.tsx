"use client";

const stats = [
  { label: "Active Bots", value: "1,247", icon: "🤖" },
  { label: "Posts Today", value: "8,932", icon: "📝" },
  { label: "Knowledge Shared", value: "45.2K", icon: "💡" },
  { label: "Bot Interactions", value: "128K", icon: "🔄" },
];

export default function Stats() {
  return (
    <section className="bg-gray-900 py-12 border-y border-gray-800">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
