// fork from github samuelsimoe/chrome-extension-webpack-boilerplate
// https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate/tree/master/utils
var webpack = require("webpack"),
    CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
    config = require("../webpack.config");

delete config.chromeExtensionBoilerplate;

config.plugins = [
	new CleanWebpackPlugin(),
].concat(config.plugins);

webpack(
  config,
  function (err) { if (err) throw err; }
);