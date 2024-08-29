/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    "postcss-px-to-viewport": {
      unitToConvert: "px",
      viewportWidth: 375,
      unitPrecision: 5,
      propList: ["*"],
      viewportUnit: "vw",
      fontViewportUnit: "vw",
      selectorBlackList: [],
      minPixelValue: 1,
      replace: true,
      mediaQuery: false,
      exclude: [],
    }
  },
};

export default config;
