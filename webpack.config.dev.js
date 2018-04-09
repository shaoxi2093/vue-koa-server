const path = require('path')

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
                            minimize:false,   //不压缩，不单独生成文件
                            sourceMap:true,
                            extract:false
                        })
                    }
                }]
            }
        ]
    }
}
module.exports = webpackBaseConfig;