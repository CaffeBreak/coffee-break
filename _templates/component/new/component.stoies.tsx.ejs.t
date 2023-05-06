---
to: <%= path %>/<%= name%>.stories.tsx
---
import type { Meta, StoryObj } from "@storybook/react";

import <%= name %> from ".";

type T = typeof <%= name %>;

export default {
  component: <%= name %>,
  args: {},
} as Meta<T>;

export const Default: StoryObj<T> = {};
