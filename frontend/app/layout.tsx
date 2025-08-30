import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LogsProvider } from "@/context/LogsContext";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Log Watcher ",
  description: "Monitor and search your application logs in real-time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LogsProvider>{children}</LogsProvider>
      </body>
    </html>
  );
}
