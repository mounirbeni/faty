import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "For My Love — Our Little Game",
  description: "A romantic Q&A game to help us get to know each other before we finally meet.",
  robots: "noindex, nofollow",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "My Angel",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-512.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${outfit.variable} h-[100dvh] antialiased`}>
      <body className="h-[100dvh] w-full overflow-hidden flex flex-col font-[family-name:var(--font-outfit)] select-none touch-manipulation">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
