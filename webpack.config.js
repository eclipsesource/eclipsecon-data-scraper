module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
    filename: "index.js",
    path: __dirname + "/dist"
  },
  resolve: { extensions: [".js"] },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: []
      }
    ]
  }
};
