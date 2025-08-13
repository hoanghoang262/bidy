import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Header, Footer } from "../components/layout";
import Provider from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import { PreloadManager } from "@/components/common/preload-manager";
import { PageErrorBoundary } from "@/components/common/error-boundary";
import { SearchParamsWrapper } from "@/components/common/SearchParamsWrapper";

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bidy",
  description: "Đấu Giá Online",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <PageErrorBoundary>
          <Provider>
            <SearchParamsWrapper>
              <Header />
            </SearchParamsWrapper>
            {children}
            <Footer />
            <Toaster />
            <PreloadManager />
          </Provider>
        </PageErrorBoundary>
      </body>
    </html>
  );
}