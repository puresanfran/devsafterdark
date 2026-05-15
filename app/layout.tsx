import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevsAfterDark — The Internet After Bedtime",
  description: "Late-night conversations with the people who keep the internet running while you sleep — the founders, the maintainers, the on-call engineers, and the friends-of-friends with one truly weird production story.",
  openGraph: {
    title: "DevsAfterDark — The Internet After Bedtime",
    description: "A podcast for night-shift builders.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,700;1,800&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
