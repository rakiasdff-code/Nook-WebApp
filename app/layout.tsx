import type { Metadata } from "next";
import { Inter, Vollkorn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const vollkorn = Vollkorn({
  subsets: ["latin"],
  variable: "--font-vollkorn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nook - Your Reading Sanctuary",
  description: "Track your reading journey in immersive atmospheric environments. Find your perfect reading nook.",
  keywords: ["reading", "books", "tracking", "library", "atmosphere"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${vollkorn.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

