"use client";
import { Provider as JotaiProvider } from "jotai";
import { Inter } from "next/font/google";
import React from "react";

import "./globals.css";
import { Header } from "../components/ui/global/header";
import { trpc } from "../utils/trpc";

const inter = Inter({ subsets: ["latin"] });

const RootLayout: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <html lang="ja">
      <JotaiProvider>
        <body className={inter.className}>
          <div className="h-screen w-screen">
            <Header />
            {props.children}
          </div>
        </body>
      </JotaiProvider>
    </html>
  );
};

export default trpc.withTRPC(RootLayout);
