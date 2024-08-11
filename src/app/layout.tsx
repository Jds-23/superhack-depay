import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import AppContext from "@/context/AppContext";
import localFont from 'next/font/local';
const myFont = localFont({ src: '../fonts/gilroy/Gilroy-Medium.ttf' })
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "DePay",
  description: "Decentralized Payment Gateway",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={myFont.className}>
        <AppContext>
          <div className="relative">
            <a
              href="https://discord.gg/qGyzvz4NaX"
              target="_blank"
              className="fixed bottom-[20px] right-[20px] z-[99999] border border-input bg-background rounded-lg shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              Support
            </a>
            {children}
          </div>
          <Toaster />
        </AppContext>
      </body>
    </html >
  );
}
