const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('react-scripts/config/paths');
const { processMainAppJs } = require("./config/salesforce");

module.exports = function override(config, env) {
    const isEnvDevelopment = env === 'development';
    const isEnvProduction = env === 'production';
    const string = "abcdefghijklmnopqrstuvwxyz";
    var splitStaticResources = 'splitStaticResourcesFlag';
    const shortCode = Array(8).join().split(',').map(function() { return string.charAt(Math.floor(Math.random() * string.length)); }).join('');
    process.env.REACT_APP_BUNDLE_ID = "."+shortCode;
    processMainAppJs();

    //Custom work for salesforce
    let fileName = isEnvProduction
            ? 'static/js/main.bundle'+process.env.REACT_APP_BUNDLE_ID+'.js'
            : isEnvDevelopment && 'static/js/main.bundle'+process.env.REACT_APP_BUNDLE_ID+'.js';
    let chunkFilename = isEnvProduction
            ? 'static/js/main.chunk'+process.env.REACT_APP_BUNDLE_ID+'.js'
            : isEnvDevelopment && 'static/js/main.chunk'+process.env.REACT_APP_BUNDLE_ID+'.js';
    let cssFilename = 'static/css/main'+process.env.REACT_APP_BUNDLE_ID+'.css';
    let cssChunkFilename = 'static/css/main.chunk'+process.env.REACT_APP_BUNDLE_ID+'.css';
    if(splitStaticResources === 'true'){
        chunkFilename = isEnvProduction
            ? 'chunk/js/main.chunk'+process.env.REACT_APP_BUNDLE_ID+'.js'
            : isEnvDevelopment && 'chunk/js/main.chunk'+process.env.REACT_APP_BUNDLE_ID+'.js';
        cssFilename = 'css/main'+process.env.REACT_APP_BUNDLE_ID+'.css';
        cssChunkFilename = 'css/main.chunk'+process.env.REACT_APP_BUNDLE_ID+'.css';
    }
    config.module.rules = [
        // salesforce dependencies
        // this will compile salesforce lightning as src, not as package
        {
            test: /\.jsx?$/,
            include: [
                'node_modules/@salesforce/design-system-react',
            ].map(
                someDir => path.resolve(
                    process.cwd(),
                    someDir
                )
            ),
            loader: require.resolve('babel-loader'),
            options: {
                presets: [
                    "react-app"
                ],
            },
        },
    ].concat(config.module.rules);

    //Override js output file names
    config.output = {
        ...config.output,
        // There will be one main bundle, and one file per asynchronous chunk.
        // In development, it does not produce real files.
        filename: fileName,
        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: chunkFilename,
        publicPath: process.env.REACT_APP_PUBLIC_URL
    };

    //Override css output file names
    let plugins = [];
    config.plugins.map((plugin, key) => {
        if(plugin.hasOwnProperty("options") && plugin.options.hasOwnProperty("filename") && plugin.options.filename.indexOf("static/css/[name]") !== -1){
            plugins[key] = new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: cssFilename,
                chunkFilename: cssChunkFilename,
            });
        }/*else if(plugin.hasOwnProperty("userOptions") && plugin.userOptions.hasOwnProperty("template") && plugin.userOptions.template.indexOf("index.html") !== -1) {
            plugins[key] = new HtmlWebpackPlugin(
                Object.assign(
                  {},
                  {
                    inject: false,
                    template: paths.appHtml,
                  },
                  isEnvProduction
                    ? {
                        minify: {
                          removeComments: true,
                          collapseWhitespace: true,
                          removeRedundantAttributes: true,
                          useShortDoctype: true,
                          removeEmptyAttributes: true,
                          removeStyleLinkTypeAttributes: true,
                          keepClosingSlash: true,
                          minifyJS: true,
                          minifyCSS: true,
                          minifyURLs: true,
                        },
                      }
                    : undefined
                )
              );
        }*/else {
            plugins[key] = plugin;
        }
        return null;
    });
    config.plugins = plugins;
    return config;
}