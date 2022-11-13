module.exports = {
  entry: "./src/index.tsx",
  output: {
    libraryTarget: "commonjs",
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".ts", ".tsx"],
  },
  externals: {
    ajv: "ajv",
    react: "react",
    cds_city: "@cds/city",
    cds_core: "@cds/core",
    cds_react: "@cds/react",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
