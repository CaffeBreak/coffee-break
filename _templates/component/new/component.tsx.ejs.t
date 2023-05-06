---
to: <%= path %>/index.tsx
---
import { NextPage } from "next";
<% if (hasProps) { -%>

export type <%= name%>Props = {};
<% } -%>

const <%= name%>: <%- typeAnnotation %> = <%= props %> => {
  return <><%= name%></>;
};

export default <%= name%>;
