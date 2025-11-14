import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWAInstaller from "@/components/PWAInstaller";

export const metadata: Metadata = {
  title: "Daily Carb Tracker",
  description: "Track your daily carbohydrate intake across all meals",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Daily Carb Tracker",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PWAInstaller />
        {children}
      </body>
    </html>
  );
}
