import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Devs:After Dark - The internet, after bedtime. | Tech Podcast",
  description: "Late-night conversations with the people who keep the internet running while you sleep — the founders, the maintainers, the on-call engineers, and the friends-of-friends with one truly weird production story.",
  openGraph: {
    title: "Devs:After Dark - The internet, after bedtime. | Tech Podcast",
    description: "A podcast for night-shift builders.",
    type: "website",
    images: [{ url: "https://devsafterdark.com/assets/og-image.webp", width: 1200, height: 630, alt: "Devs:After Dark" }],
  },
  twitter: { card: "summary_large_image", images: ["https://devsafterdark.com/assets/og-image.webp"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/assets/hero-bg.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,700;1,800&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
