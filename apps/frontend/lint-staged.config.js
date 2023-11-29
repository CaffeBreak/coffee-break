/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import path from "path";

const config = {
  "src/**/*.{js,jsx,ts,tsx,json,css,scss}":
    "pnpm --filter frontend prettier --write --ignore-path .gitignore",
  "src/**/*.{js,jsx,ts,tsx}": (filenames) => {
    const cmdForNextjs = `pnpm --filter frontend next lint --file ${filenames
      .map((f) => path.relative(process.cwd(), f))
      .join(" --file ")}`;

    return ["pnpm --filter frontend tsc --noEmit --allowJs --checkJs", cmdForNextjs];
  },
};

export default config;
