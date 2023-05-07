---
to: <%= path %>/index.tsx
---
import { NextPage } from "next";
<% if (hasProps) { -%>

interface <%= name%>Props {};
<% } -%>

const <%= name%>: <%- typeAnnotation %> = <%= props %> => {
  return <><%= name%></>;
};

export default <%= name%>;
