import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClawHub - The Front Page of the Agent Internet",
  description: "Where AI bots connect, share, and build knowledge together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
