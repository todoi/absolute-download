// fork from github samuelsimoe/chrome-extension-webpack-boilerplate
// https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate

var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./webpack/env"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    WriteFilePlugin = require("write-file-webpack-plugin");

// load the secrets
var alias = {};

var secretsPath = path.join(__dirname, "secrets." + env.NODE_ENV + ".js");

// var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

if (fileSystem.existsSync(secretsPath)) {
    alias["secrets"] = secretsPath;
}

var options = {
    devtool: "source-map",
    mode: process.env.NODE_ENV || "development",
    entry: {
        popup: path.join(__dirname, "src", "js", "popup.js"),
        options: path.join(__dirname, "src", "js", "options.js"),
        background: path.join(__dirname, "src", "js", "background.js"),
        content: path.join(__dirname, "src", "js", "content.js"),
        icons: path.join(__dirname, "src", "js", "icons.js"),
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
                exclude: /node_modules/,
            },
            {
                // test: new RegExp(".(" + fileExtensions.join("|") + ")$"),
                test: /\.(png|jpe?g|gif)$/i,
                loader: "file-loader",
                exclude: /node_modules/,
                options: {
                    name: "[name].[ext]",
                    outputPath: "images",
                },
            },
            {
                test: /\.html$/,
                loader: "html-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                include: [path.resolve(__dirname, "src")],
                loader: "babel-loader",
            },
        ],
    },
    resolve: {
        alias: alias,
    },
    plugins: [
        // expose and write the allowed env vars on the compiled bundle
        new webpack.EnvironmentPlugin(["NODE_ENV"]),
        new CopyWebpackPlugin([
            {
                from: "src/manifest.json",
                transform: function (content, path) {
                    // generates the manifest file using the package.json informations
                    return Buffer.from(
                        JSON.stringify({
                            description: process.env.npm_package_description,
                            version: process.env.npm_package_version,
                            ...JSON.parse(content.toString()),
                        })
                    );
                },
            },
            {
                from: path.join(__dirname, "node_modules/jquery/dist/jquery.min.js"),
                to: path.join(__dirname, "build/bundle/"),
            },
            {
                from: path.join(__dirname, "node_modules/art-dialog/dist/dialog.js"),
                to: path.join(__dirname, "build/bundle/")
            },
        ]),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "popup.html"),
            filename: "popup.html",
            chunks: ["popup"],
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "options.html"),
            filename: "options.html",
            chunks: ["options"],
        }),
        // new HtmlWebpackPlugin({
        //   template: path.join(__dirname, "src", "background.html"),
        //   filename: "background.html",
        //   chunks: ["background"]
        // }),
        new WriteFilePlugin(),
    ],
};

module.exports = options;
