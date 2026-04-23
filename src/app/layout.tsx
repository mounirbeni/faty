import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "لكِ فاتي — لعبتنا الصغيرة",
  description: "لعبة أسئلة رومانسية لنتعرف على بعضنا أكثر قبل اللقاء.",
  robots: "noindex, nofollow",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Faty",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-[100dvh] antialiased`}>
      <body className="h-[100dvh] w-full overflow-hidden flex flex-col font-[family-name:var(--font-cairo)] select-none touch-manipulation">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
