const qiniu = require('qiniu')

const HOST = 'https://node-deploy-vue-static.iblack7.com' // 你的七牛 bucket 域名
const ACCESS_KEY = '你的七牛 ACCESS_KEY'
const SECRET_KEY = '你的 oss SECRET_KEY'
const BUCKET = 'dist' // 你的七牛 bucket
const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY)

const config = new qiniu.conf.Config()
config.useHttpsDomain = true

class Qiniu {
  constructor() {
    this.getToken = this.getToken.bind(this)
    this.upload = this.upload.bind(this)
  }

  getToken (bucket, key) {
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: bucket + ':' + key
      // returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    })
    return putPolicy.uploadToken(mac)
  }

  upload (filePath, cdnFilePath) {
    const token = this.getToken(BUCKET, cdnFilePath)
    return new Promise((resolve, reject) => {
      const formUploader = new qiniu.form_up.FormUploader(config)
      const extra = new qiniu.form_up.PutExtra()
      formUploader.putFile(token, cdnFilePath, filePath, extra, function (err, body, info) {
        if (err) {
          reject(err)
        }
        if (info.statusCode === 200) {
          const { key } = body
          resolve(HOST + '/' + key)
        } else {
          reject(body)
        }
      })
    })
  }
}

module.exports = new Qiniu()
