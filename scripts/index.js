const path = require('path')
const glob = require('glob')
const Qiniu = require('../utils/qiniu')
const Oss = require('../utils/oss')

const distPath = path.resolve(__dirname, '../dist')

const htmls = glob.sync(`${distPath}/*.html`)
const css = glob.sync(`${distPath}/**/*.css`)
const js = glob.sync(`${distPath}/**/*.js`)

async function quene (list, cb) {
  for (const i of list) {
    /* eslint-disable */
    const url = await cb(...i)
    console.log('上传成功: ', url)
  }
}

async function uploadResources () {
  const resources = []
    .concat(js, css)
    .map(e => [
      e, `${path.extname(e).slice(1)}/${path.basename(e)}`
    ])
  await quene(resources, Qiniu.upload)
}
/* eslint-disable */
async function uploadHtmls () {
  const list = htmls.map(e => [
    e,
    `${path.basename(e)}`
  ])
  await quene(list, Oss.upload)
}

Promise.all([
  uploadResources()
  // uploadHtmls()
])
