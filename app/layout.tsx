import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";
import { StockSearchModal } from "@/components/shared/stock-search-dialog";
import { WebSocketProvider } from "@/components/providers/web-socket-provider";
import Providers from "@/components/providers/providers";
import { AlertModal } from "@/components/alerts/AlertModal";

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

export default function RootLayout({
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
          <StockSearchModal />
          <AlertModal />
          <WebSocketProvider> {children}</WebSocketProvider>
          <Toaster richColors position="top-right" duration={3000} closeButton />
        </Providers>

      </body>



    </html>
  );
}
