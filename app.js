const NODE_ENV = process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const IS_DEV_ENV = NODE_ENV == 'development'
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes

app.use(ctx => {
  console.log(ctx);
})

app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

console.log(NODE_ENV);
//构建前端应用
if(IS_DEV_ENV){
  let webpack = require('webpack'),
      webpackDevMiddleware = require('webpack-dev-middleware'),
      webpackHotMiddleware = require('webpack-hot-middleware'),
      webpackDevConfig = require('./webpack.config.dev');

  let compiler = webpack(webpackDevConfig);
  let devMiddleware = webpackDevMiddleware(compiler,{
    publicPath:webpackDevConfig.output.publicPath,
      noInfo:true,
      stats: {
        colors:true
      }
  });
  let _readFileSync_ = devMiddleware.fileSystem.readFileSync.bind(devMiddleware.fileSystem);

  app.use( ctx => {

  })

}

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
