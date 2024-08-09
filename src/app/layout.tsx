import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import AppContext from "@/context/App";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Header />
        <AppContext>{children}</AppContext>
      </body>
    </html>
  );
}
