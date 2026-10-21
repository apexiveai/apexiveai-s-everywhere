import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CommunityShell from "../components/CommunityShell";
import ProductAssistant from "../components/ProductAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apexive AI | Community & Auctions",
  description:
    "Discover Apexive AI products, community resources, security guidance, and an online auction marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <CommunityShell>{children}</CommunityShell>
        <ProductAssistant />
      </body>
    </html>
  );
}