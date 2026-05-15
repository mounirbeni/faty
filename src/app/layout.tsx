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
          {/* Top crimson halo — the "heart" of the app */}
          <div style={{
            position: 'absolute',
            top: '-25%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '130vw',
            height: '70vh',
            background: 'radial-gradient(ellipse, rgba(210,12,55,0.24) 0%, rgba(150,5,40,0.1) 45%, transparent 68%)',
            filter: 'blur(55px)',
          }} />
          {/* Bottom-left violet aurora */}
          <div style={{
            position: 'absolute',
            bottom: '-18%',
            left: '-18%',
            width: '75vw',
            height: '60vh',
            background: 'radial-gradient(ellipse, rgba(95,22,200,0.16) 0%, transparent 60%)',
            filter: 'blur(58px)',
          }} />
          {/* Right warm ember */}
          <div style={{
            position: 'absolute',
            top: '38%',
            right: '-12%',
            width: '48vw',
            height: '48vh',
            background: 'radial-gradient(ellipse, rgba(180,75,15,0.09) 0%, transparent 60%)',
            filter: 'blur(52px)',
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
