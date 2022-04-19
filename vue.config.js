// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PrerenderSPAPlugin = require("prerender-spa-plugin");

module.exports = {
  publicPath: "/",
  chainWebpack(config) {
    config.plugins.delete("prefetch");
  },
  pwa: {
    name: "Made With Appwrite",
    workboxOptions: {
      exclude: [/_redirects/],
    },
    themeColor: "#4A90E2",
  },
  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, "dist"),
        // Required - Routes to render.
        routes: ["/"],
      }),
    ],
  },
  pluginOptions: {
    compression: {
      gzip: {
        filename: "[file].gz[query]",
        algorithm: "gzip",
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        minRatio: 0.8,
      },
    },
  },
  productionSourceMap: false,
  transpileDependencies: ["vue-meta"],
};
