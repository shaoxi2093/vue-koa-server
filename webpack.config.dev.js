const path = require('path')
const webpack = require('webpack')

let cssLoadersUtil = require('./cssLoaders')
let hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'
const webpackBaseConfig = {
    entry: {
        app: [hotMiddlewareScript, path.resolve(__dirname, './publick/src/entry/app.js')]
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
                loader: "babel-loader",
                exclude:/node_modules/
            },
            {
                test:/\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
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
        new webpack.optimize.CommonsChunkPlugin({
            name:'common',
            minChunks(module){
                return (
                    module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(
                        path.resolve(__dirname,'./node_modules')
                    ) === 0
                )
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:'development'
            }
        }),
        new HtmlWebpackPlugin({
            filename:'./app.html',
            template:path.resolve(__dirname,'./views/app.html'),
            inject:true,
            chunks:['app','common']
        })
    ]
}
module.exports = webpackBaseConfig;