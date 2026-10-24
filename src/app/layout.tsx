import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "https://valentino-prototype-1.vercel.app"),
  title: "Valentino — Interactive Romantic Experience Studio",
  description: "Create private, unforgettable interactive romantic worlds — letters, memories, timelines, quizzes, and secret moments.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Valentino — Interactive Romantic Experience Studio",
    description: "Create private, unforgettable interactive romantic worlds — letters, memories, timelines, quizzes, and secret moments.",
    url: "/",
    siteName: "Valentino",
    images: [
      {
        url: "/og-share-card.png",
        width: 1200,
        height: 630,
        alt: "Valentino — A Valentine Experience",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valentino — Interactive Romantic Experience Studio",
    description: "Create private, unforgettable interactive romantic worlds — letters, memories, timelines, quizzes, and secret moments.",
    images: ["/og-share-card.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { PageCurtains } from "@/components/motion/PageCurtains";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="antialiased min-h-[100dvh] flex flex-col font-sans bg-[#0A090C] text-[#FAF8F5]">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <PageCurtains />
      </body>
    </html>
  );
}
