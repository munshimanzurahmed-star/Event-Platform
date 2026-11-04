import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BUSINESS ADD-ON | Think Fast. Create Big. Build the Future.",
  description:
    "Three-day mega business, innovation & entertainment festival in Mumbai. Keynotes, timed challenges, networking, artists and more.",
  keywords: ["business festival", "Mumbai", "startup", "innovation", "networking", "challenges"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased dark-gradient">
        {children}
      </body>
    </html>
  );
}
