---
to: <%= path %>/layout.tsx
---
import { NextPage } from "next";
import { ReactNode } from "react";

interface <%= name%>LayoutProps {
  children: ReactNode;
}

const <%= name%>Layout: NextPage<<%= name%>LayoutProps> = (props) => {
  return <>{props.children}</>;
};

export default <%= name%>Layout;
