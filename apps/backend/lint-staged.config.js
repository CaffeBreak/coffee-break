/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

export default {
  "src/**/*.{js,ts}": (filenames) => [
    // "pnpm tsc --noEmit --skipLibCheck",
    `pnpm eslint --ignore-path .gitignore --fix ${filenames.join(" ")}`,
  ],
  "src/**/*.{js,ts,json,css,scss}": "pnpm prettier --write --ignore-path .gitignore",
};
