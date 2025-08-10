import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Header, Footer } from "../components/layout";
// Removed Suspense - all components load immediately for faster navigation
import Provider from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import { PreloadManager } from "@/components/common/preload-manager";

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bidy",
  description: "Đấu Giá Online",
};

function HeaderFallback() {
  return (
    <header className="w-full h-16 bg-background flex items-center justify-center">
      <div className="text-foreground">Đang tải...</div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased overflow-x-hidden`}>
        <Provider>
          <Header />
          {children}
          <Footer />
          <Toaster />
          <PreloadManager />
        </Provider>
      </body>
    </html>
  );
}