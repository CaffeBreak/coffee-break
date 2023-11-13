"use client";
import { Provider as JotaiProvider } from "jotai";
import { Inter } from "next/font/google";
import React from "react";

import "./globals.css";
import { TrpcProvider } from "@/utils/trpc-provider";

import { Header } from "../components/ui/global/header";

const inter = Inter({ subsets: ["latin"] });

const RootLayout: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <html lang="ja">
      <JotaiProvider>
        <TrpcProvider>
          <body className={inter.className}>
            <div className="h-screen w-screen">
              <Header />
              {props.children}
            </div>
          </body>
        </TrpcProvider>
      </JotaiProvider>
    </html>
  );
};

export default RootLayout;
