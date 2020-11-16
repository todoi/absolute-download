// fork from github samuelsimoe/chrome-extension-webpack-boilerplate
// https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate/tree/master/utils
var webpack = require("webpack"),
    config = require("../webpack.config");

delete config.chromeExtensionBoilerplate;

webpack(
  config,
  function (err) { if (err) throw err; }
);