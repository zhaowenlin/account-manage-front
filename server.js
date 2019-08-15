const fs = require('fs')
const path = require('path')
const os = require('os')
const https = require('https')
const Koa = require('koa')
const rewrite = require('koa-rewrite')
const serve = require('koa-static')

const useHttps = process.env.npm_config_https
const app = new Koa()
const PORT = useHttps ? 8443 : 5000
const homedir = os.homedir()

app.use((ctx, next) => {
  ctx.set('X-Power-by', `koa/${require('koa/package.json').version} `)
  if (isGetHtml(ctx.path) || ctx.path === '/service-worker.js') {
    ctx.set('Cache-Control', 'no-cache')
  }
  return next()
})

// 静态资源处理
app.use(rewrite(/^\/account-manage-front\/([^?]+)(\?.+)?$/, '/$1'))

// 预渲染生成页面的目录
app.use(serve('./dist/prerendered'))

app.use(
  serve('./dist', {
    maxage: 1000 * 3600 * 24 * 365
  })
)

app.use(ctx => {
  if (!ctx.body) {
    ctx.set('Cache-Control', 'no-cache')
    ctx.type = 'text/html'
    ctx.body = fs.readFileSync('./dist/index.html')
  }
})

if (useHttps) {
  const certOptions = {
    key: fs.readFileSync(
      path.resolve(homedir, './Documents/crts/localhost.key')
    ),
    cert: fs.readFileSync(
      path.resolve(homedir, './Documents/crts/localhost.crt')
    )
  }
  https.createServer(certOptions, app.callback()).listen(PORT)
  console.log(`server started at https://localhost:${PORT}`)
} else {
  app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`)
  })
}

function isGetHtml(path) {
  return /\.html$/.test(path) || !/\w+\.\w+$/.test(path)
}
