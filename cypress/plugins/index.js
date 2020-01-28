// eslint-disable-next-line @typescript-eslint/no-var-requires
const wp = require("@cypress/webpack-preprocessor");

module.exports = on => {
  const options = {
    webpackOptions: {
      mode: "development",
      devtool: "eval-source-map",
      resolve: {
        extensions: [".ts", ".tsx", ".js"]
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: "ts-loader",
            options: { transpileOnly: true }
          }
        ]
      }
    }
  };
  on("file:preprocessor", wp(options));
};
