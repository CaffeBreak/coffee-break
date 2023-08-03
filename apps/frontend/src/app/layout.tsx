import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const RootLayout: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <html lang="ja">
      <body className={inter.className}>{props.children}</body>
    </html>
  );
};

export default RootLayout;
