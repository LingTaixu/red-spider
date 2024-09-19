module.exports = {
  plugins: {
    // ...
    "postcss-px-to-viewport": {
      viewportWidth: 375,
      viewportUnit: "vw",
      selectorBlackList: ["text-with-shadow"]
    }
  }
};
