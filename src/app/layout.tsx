import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "For My Love — Our Little Game",
  description: "A romantic journey built just for you.",
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
  themeColor: "#070310",
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

        {/* ── Permanent ambient background — always behind every screen ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {/* Marrakech — top-right rose halo */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '80vw',
            height: '65vh',
            background: 'radial-gradient(ellipse, rgba(210,12,55,0.22) 0%, rgba(150,5,40,0.09) 48%, transparent 68%)',
            filter: 'blur(60px)',
          }} />
          {/* Meknes — top-left amber/gold halo */}
          <div style={{
            position: 'absolute',
            top: '-15%',
            left: '-15%',
            width: '75vw',
            height: '60vh',
            background: 'radial-gradient(ellipse, rgba(217,119,6,0.18) 0%, rgba(180,90,10,0.08) 48%, transparent 68%)',
            filter: 'blur(62px)',
          }} />
          {/* Connection point — center violet where hearts meet */}
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '50vw',
            height: '40vh',
            background: 'radial-gradient(ellipse, rgba(120,40,180,0.12) 0%, transparent 65%)',
            filter: 'blur(55px)',
          }} />
          {/* Bottom warmth */}
          <div style={{
            position: 'absolute',
            bottom: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60vw',
            height: '40vh',
            background: 'radial-gradient(ellipse, rgba(180,40,20,0.08) 0%, transparent 60%)',
            filter: 'blur(50px)',
          }} />
        </div>

        {/* ── App content ── */}
        <div style={{ position: 'relative', zIndex: 1, height: '100dvh', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>

        <RegisterSW />
      </body>
    </html>
  );
}
