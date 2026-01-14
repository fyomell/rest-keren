import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TikTok API Tester",
  description: "Dibuat dengan Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
