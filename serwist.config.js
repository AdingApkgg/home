/** @type {import("@serwist/cli").SerwistConfigInput} */
const config = {
  swSrc: "src/app/sw.ts",
  swDest: "out/sw.js",
  globDirectory: "out",
  globPatterns: [],
  injectionPoint: undefined,
  esbuildOptions: {
    target: "es2020",
  },
};

module.exports = config;
