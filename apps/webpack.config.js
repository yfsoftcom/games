const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV === 'production'? 'production': 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
        type: "asset/resource"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ],
  devServer: {
    hot: true,
    static: [{ directory: path.join(__dirname, 'public') },
    { directory: path.join(__dirname, 'src/assets'), publicPath: '/assets'},
    { directory: path.join(__dirname, 'src/css'), publicPath: '/css'}],
    port: 9000,
  },
};