const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let cssLoadersUtil = require('./cssLoaders')
let hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'

const webpackBaseConfig = {
    mode: 'development',
    entry: {
        app: [hotMiddlewareScript, path.resolve(__dirname, './public/src/entry/app.js')]
    },
    output: {
        path: path.resolve(__dirname, './public/dist'),
        publicPath: "/",
        filename: "[name].[hash].js",
        chunkFilename: "[id].[chunkhash].js"
    },
    resolve: {
        extensions: ['.js','.vue','.jsx','.json'],
        alias: {
            assets:path.resolve(__dirname,'./public/src/assets')
        }
    },
    module: {
        rules: [
            {
                test:/\.vue$/,
                use: [{
                    loader: "vue-loader",
                    options: {
                        loaders:cssLoadersUtil.cssLoaders({
                            minimize:true,
                            sourceMap:false,
                            extract:false
                        })
                    }
                }]
            },
            {
                test:/\.html$/,
                use: "html-loader"
            },
            {
                test:/\.js|\.jsx$/,
                loader: "babel-loader",
                exclude:/node_modules/
            },
            {
                test:/\.css$/,
                use: [MiniCssExtractPlugin.loader,"css-loader","postcss-loader"]
            },
            {
                test:/\.scss$/,
                loader: "style-loader!css-loader!postcss-loader!sass-loader",
                exclude:/node_modules/
            },
            {
                test:/\.svg/,
                loader: "svg-sprite-loader",
                options: {
                    symbolId:'icon-[name]'
                }
            },
            {
                test:/\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader?limit=8192",
            },
            {
                test:/\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: "file-loader"
            }
        ]
    },
    devtool: "#source-map",
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HashedModuleIdsPlugin(),

        new webpack.optimize.OccurrenceOrderPlugin(),

        new HtmlWebpackPlugin({
            filename:'./app.html',
            template:path.resolve(__dirname,'./views/app.html'),
            inject: true,
            minify: {
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true
            },
            chunks:['app','common']
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings:false
            }
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    optimization:{
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
}
module.exports = webpackBaseConfig;