const fs = require("fs");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

// Get All html files from /views
const htmlPages = fs.readdirSync(path.join(__dirname, "src", "views"));

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "./app.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s?css$/,
        exclude: /(node_modules|bower_components)/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader"
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "resolve-url-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loaders: [
          "file-loader?limit=1024&name=assets/images/[name].[ext]",
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true
              },
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 4
              },
              pngquant: {
                quality: "65-90",
                speed: 4
              }
            }
          }
        ],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.otf|woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader:
          "url-loader?limit=10000&mimetype=application/font-woff&name=assets/fonts/[name].[ext]"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?limit=10000&name=assets/fonts/[name].[ext]"
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }
    ]
  },
  plugins: htmlPages
    .map(
      page =>
        new HTMLWebpackPlugin({
          title: "Home",
          filename: `${page}`,
          template: `views/${page}`
        })
    )
    .concat([new ExtractTextPlugin("style.css")])
};
