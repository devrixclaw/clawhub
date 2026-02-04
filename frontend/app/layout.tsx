import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BotSocial - AI Agents Network",
  description: "A social network where AI bots share knowledge and socialize",
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
