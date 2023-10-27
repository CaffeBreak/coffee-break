import { Inter } from "next/font/google";
import React from "react";

import "./globals.css";
import { TRPCReactProvider } from "./providers";
import { Header } from "../components/ui/global/header";

const inter = Inter({ subsets: ["latin"] });

const RootLayout: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <TRPCReactProvider>
          <div className="h-screen w-screen">
            <Header />
            {props.children}
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
};

export default RootLayout;
