export default {
  "src/**/*.{js,ts}": [
    "pnpm --filter backend tsc --noEmit --allowJs --checkJs",
    "pnpm --filter backend eslint --ignore-path .gitignore --fix",
  ],
  "src/**/*.{js,ts,json,css,scss}":
    "pnpm --filter backend prettier --write --ignore-path .gitignore",
};
