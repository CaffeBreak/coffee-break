import * as path from "path";

const config =  {
  "src/**/*.{js,jsx,ts,tsx,json,css,scss}":
    "pnpm prettier --write --ignore-path .gitignore",
  "src/**/*.{js,jsx,ts,tsx}": (filenames) => {
    const cmdForNextjs = `pnpm lint --file ${filenames
      .map((f) => path.relative(process.cwd(), f))
      .join(" --file ")}`;

    return ["pnpm tsc --noEmit --allowJs --checkJs", cmdForNextjs];
  },
};

export default config;
