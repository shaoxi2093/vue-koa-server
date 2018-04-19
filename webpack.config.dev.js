const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let cssLoadersUtil = require('./cssLoaders')
let hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
                            minimize:false,   //不压缩，debug标记源位置，不单独生成文件
                            sourceMap:true,
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
                use: "babel-loader",
                exclude:/node_modules/
            },
            {
                test:/\.css$/,
                use: ['style-loader',"css-loader","postcss-loader"]
            },
            {
                test:/\.scss$/,
                use: "style-loader!css-loader!postcss-loader!sass-loader",
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
                use: "url-loader?limit=8192",
            },
            {
                test:/\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                use: "file-loader"
            }
        ]
    },
    devtool: "#source-map",
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        // new MiniCssExtractPlugin({
        //     // Options similar to the same options in webpackOptions.output
        //     // both options are optional
        //     filename: "[name].css",
        //     chunkFilename: "[id].css"
        // }),
        new HtmlWebpackPlugin({
            filename:'./app.html',
            template:path.resolve(__dirname,'./views/app.html'),
            inject:true,
            chunks:['app','common']
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
        }
    }
}
module.exports = webpackBaseConfig;