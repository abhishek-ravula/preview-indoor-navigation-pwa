import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Indoor Navigation PWA",
  description:
    "Navigate indoor spaces with ease using QR code scanning and offline maps",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IndoorNav",
  },
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
};

// ✅ Move viewport to a dedicated export
export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#3b82f6",
};

// ✅ Move themeColor to a dedicated export
// export const themeColor = "#3b82f6";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head> */}
      <body className={inter.className}>{children}</body>
      {/* <body className={inter.className}>
        <h1>Hello from PWA!</h1>;
      </body> */}
    </html>
  );
}
