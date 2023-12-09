"use client";
import { Provider as JotaiProvider } from "jotai";
import { Inter } from "next/font/google";
import React from "react";

import "./globals.css";
import { TrpcProvider } from "@/utils/trpc-provider";

const inter = Inter({ subsets: ["latin"] });

const RootLayout: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <html lang="ja">
      <JotaiProvider>
        <TrpcProvider>
          <body className={inter.className}>{props.children}</body>
        </TrpcProvider>
      </JotaiProvider>
    </html>
  );
};

export default RootLayout;
