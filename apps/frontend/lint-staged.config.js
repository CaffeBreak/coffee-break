import * as path from "path";

export default {
  "src/**/*.{js,jsx,ts,tsx}": ["pnpm tsc --noEmit --allowJs --checkJs"],
  "src/**/*.{js,jsx,ts,tsx,json,css,scss}":
    "pnpm --filter frontend prettier --write --ignore-path .gitignore",
  "src/**/*.{js,jsx,ts,tsx}": (filenames) => {
    const cmdForNextjs = `pnpm --filter frontend next lint --file ${filenames
      .map((f) => path.relative(process.cwd(), f))
      .join(" --file ")}`;

    return [cmdForNextjs];
  },
};
