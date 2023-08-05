import * as path from "path";

export default {
  "apps/**/*.{js,jsx,ts,tsx}": ["pnpm tsc --noEmit --allowJs --checkJs"],
  "apps/**/*.{js,jsx,ts,tsx,json,css,scss}":
    "pnpm prettier --write --ignore-path .gitignore",
  "apps/frontend/**/*.{jsx,tsx}": (filenames) => {
    const cmdForNextjs = `pnpm --filter frontend next lint --file ${filenames
      .map((f) => path.relative(process.cwd(), f))
      .join(" --file ")}`;

    return [cmdForNextjs];
  },
  "apps/backend/**/*.{js,ts}":
    "pnpm --filter backend eslint --ignore-path .gitignore",
};
