---
to: <%= path %>/<%= name%>.spec.tsx
---
import { render } from "@testing-library/react";

import <%= name%> from ".";

describe("<%= name%> Component", () => {
  test("Enjoy Testing!", () => {
    render(<<%= name%> />);
  });
});
