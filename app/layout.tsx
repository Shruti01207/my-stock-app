import { AlertModal } from "@/components/alerts/AlertModal";
import AppIntializer from "@/components/providers/app-intializer";
import Providers from "@/components/providers/providers";
import { WebSocketProvider } from "@/components/providers/web-socket-provider";
import { StockSearchModal } from "@/components/shared/stock-search-dialog";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Signalist",
  description: "Track real time stock prices, get personalised alerts and explore detailed company insights",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AppIntializer />
          <StockSearchModal />
          <AlertModal />
          <WebSocketProvider> {children}</WebSocketProvider>
          <Toaster richColors position="top-right" duration={3000} closeButton />
        </Providers>

      </body>



    </html>
  );
}
