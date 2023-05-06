import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = (props: RootLayoutProps) => {
  return (
    <html lang="ja">
      <body>{props.children}</body>
    </html>
  );
};

export default RootLayout;
