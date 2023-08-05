import * as path from "path";

export default {
  "apps/**/*.{js,jsx,ts,tsx}": ["pnpm tsc --noEmit --allowJs --checkJs"],
  "apps/**/*.{js,jsx,ts,tsx,json,css,scss}": "pnpm format",
  "apps/frontend/**/*.{jsx,tsx}": (filenames) => {
    const cmdForNextjs = `pnpm lint:fix --file ${filenames
      .map((f) => path.relative(process.cwd(), f))
      .join(" --file ")}`;

    return [cmdForNextjs];
  },
  "apps/backend/**/*.{js,ts}": "pnpm lint:fix",
};
