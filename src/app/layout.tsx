import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import AppContext from "@/context/AppContext";
import localFont from 'next/font/local';
const myFont = localFont({ src: '../fonts/gilroy/Gilroy-Medium.ttf' })

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
          <div className="">
            {children}
          </div>
        </AppContext>
      </body>
    </html>
  );
}
