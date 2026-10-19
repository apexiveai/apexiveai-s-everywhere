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
  title: "Apexive Community",
  description:
    "A thoughtful AI-powered platform for intelligence, automation, and community by Apexive AI.",
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