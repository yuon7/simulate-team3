import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "../../styles/globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Header } from "@/components/Header/Header";
import { ChatAssistant } from "@/components/ChatAssistant/ChatAssistant";
import { Analytics } from "@vercel/analytics/next";

import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";

export const metadata: Metadata = {
  title: "LocalLink",
  description: "地方と人材をつなぐ、シミュレーション型求人マッチングプラットフォーム",
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
        <MantineProvider theme={{ primaryColor: 'emerald', colors: { emerald: ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46', '#064e3b'] } }}>
          <Notifications />
          {/* <HeaderMegaMenu /> を <Header /> に変更 */}
          <Header />
          {children}
          <ChatAssistant />
          <Analytics />
        </MantineProvider>
      </body>
    </html>
  );
}
