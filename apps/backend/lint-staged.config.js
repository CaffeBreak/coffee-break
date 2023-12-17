/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

export default {
  "src/**/*.{js,ts}": "pnpm eslint --ignore-path .gitignore --fix",
  "src/**/*.{js,ts,json,css,scss}": "pnpm prettier --write --ignore-path .gitignore",
};
