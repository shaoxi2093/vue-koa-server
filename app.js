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
//后端路由

app.use((ctx,next) => {
  console.log(ctx);
  next();
})

// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

//vue-app
app.use( (ctx,next) => {
  if(ctx.request.accepts('html')){
    ctx.response.type = 'html';
    ctx.request.url = '/app.html'
  }
  next();
})

console.log(NODE_ENV);


//development
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
    let url = ctx.request.url;
    if(url.indexOf('.html')>-1){
        devMiddleware.fileSystem.readFileSync = function (_path,encoding) {
            let content = _readFileSync_(_path,encoding);
            //template engine can do something here
            return ctx.response.body = content;
        }
    }else {
      devMiddleware.fileSystem.readFileSync = _readFileSync_;
    }
    devMiddleware(ctx)
  })
}

//production



// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
