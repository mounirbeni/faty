import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "For Faty — Our Little Game",
  description:
    "A romantic Q&A game to help us get to know each other before we finally meet.",
  robots: "noindex, nofollow",
};

export const viewport: Viewport = {
  themeColor: "#0c0a14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col font-[family-name:var(--font-outfit)]">
        {children}
      </body>
    </html>
  );
}
