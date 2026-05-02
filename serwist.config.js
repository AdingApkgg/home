/** @type {import("@serwist/cli").SerwistConfigInput} */
const config = {
  swSrc: "src/app/sw.ts",
  swDest: "out/sw.js",
  globDirectory: "out",
  globPatterns: [
    "**/*.html",
    "_next/static/**/*.{js,css}",
    "favicon.ico",
    "manifest.webmanifest",
  ],
  globIgnores: ["**/sw.js", "**/sw.js.map"],
  esbuildOptions: {
    target: "es2020",
  },
};

export default config;
