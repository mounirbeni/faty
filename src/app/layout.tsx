import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";
import EmotionalProvider from "@/context/EmotionalProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "For My Love — Our Universe",
  description: "A private romantic world built just for you.",
  robots: "noindex, nofollow",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "My Love",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-512.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0015",
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
    <html lang="en" dir="ltr" className={`${outfit.variable} h-[100dvh] antialiased overflow-hidden`}>
      <body
        className="h-[100dvh] w-full overflow-hidden flex flex-col font-[family-name:var(--font-outfit)] select-none touch-manipulation overscroll-none"
        style={{ WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' } as React.CSSProperties}
      >

        {/* ── App content ── */}
        <EmotionalProvider>
          <div style={{ position: 'relative', zIndex: 1, height: '100dvh', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </EmotionalProvider>

        <RegisterSW />

        {/* ── Native-app hardening ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            document.addEventListener('contextmenu', function(e){ e.preventDefault(); }, { passive: false });
            document.addEventListener('touchmove', function(e){
              if (e.target.closest('[data-scroll]')) return;
              if (e.touches.length > 1) { e.preventDefault(); return; }
            }, { passive: false });
            var lastTap = 0;
            document.addEventListener('touchend', function(e){
              var now = Date.now();
              if (now - lastTap < 300) { e.preventDefault(); }
              lastTap = now;
            }, { passive: false });
          })();
        `}} />
      </body>
    </html>
  );
}
