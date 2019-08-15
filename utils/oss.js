const ALIOSS = require('ali-oss')
const BUCKET = 'nodedeploy'
const DOMAIN = `https://${BUCKET}.oss-cn-hangzhou.aliyuncs.com`
const OPTIONS = {
  region: 'oss-cn-hangzhou', // oss 的区域
  accessKeyId: '你的 oss accessKeyId',
  accessKeySecret: '你的 oss accessKeySecret',
  endpoint: 'http://oss-cn-hangzhou.aliyuncs.com' // oss endpoint
}

class OSS {
  constructor() {
    this.client = new ALIOSS(OPTIONS)
    this.client.useBucket(BUCKET)
    this.upload = this.upload.bind(this)
  }

  async upload (filePath, cdnFilePath) {
    await this.client.put(cdnFilePath, filePath)
    return `${DOMAIN}/${cdnFilePath}`
  }
}

module.exports = new OSS()
