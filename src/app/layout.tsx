"use client";
import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "../../styles/globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Header } from "@/components/Header/Header";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Next-Hono-Template",
  description: "A modern template combining Next.js and Hono.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider>
          {/* <HeaderMegaMenu /> を <Header /> に変更 */}
          <Header />
          {children}
          <Analytics />
        </MantineProvider>
      </body>
    </html>
  );
}
