/*
 * @Description: 此文件主要是用来自动上传微信小程序到公众平台后台的，避免了每次使用开发工具上传（我主要是配合Jenkins来使用的，有需要也可以）
 * @Author: langjitianya-king
 * @Date: 2023-11-02 10:52:10
 * @LastEditTime: 2023-11-02 11:52:10
 * @LastEditors: langjitianya-king
 * @Usage:用法：yarn run wxminci  version=1.0.1 appid=wxAPPID1 buildenv=production
 */
const config = require('./src/config/index.js')
const ci = require('miniprogram-ci')

/**
 * version:版本号，必填
 * appid:小程序appid，必填
 * buildenv：构建环境，暂无作用，看自己需要，需要在代码逻辑特殊处理可传
 * platform: 构建平台
 * desc:版本描述，必填
 */
const {
  version = '',
  appid = '',
  buildenv = '',
  platform = 'mp-weixin',
} = getEnvParams(process.argv)
const { desc = '' } = config
if (!appid) {
  console.error('appid不能为空!!!')
  process.exit(1)
}
// 微信小程序的私有key文件存储路径（需要在公众平台后台下载【开发-开发管理-开发设置-小程序代码上传-小程序代码上传密钥】）
const privateKeyPath = `/uploadSecret/private.${appid}.key`
// 微信小程序目录（绝对路径）
const projectPath = `/dist/${platform}/${appid}`
// 微信小程序预览二维码图片存储路径
const qrcodeUrl = `./qrcode.jpg`
// 请求参数
const reqParams = {
  appid,
  type: 'miniProgram',
  projectPath,
  privateKeyPath,
  ignores: ['node_modules/**/*', 'yarn.lock', '.*'],
}
// 上传参数
const uploadParams = {
  es6: false, //  "es6 转 es5"
  es7: true, // "增强编译"
  minify: true, // "样式自动补全"
  codeProtect: true, // "代码保护"
  autoPrefixWXSS: true, // "样式自动补全"
}

const project = new ci.Project({ ...reqParams })

// 小程序预览二维码
;(async () => {
  const previewResult = await ci.preview({
    project,
    desc,
    setting: uploadParams,
    qrcodeFormat: 'image',
    qrcodeOutputDest:qrcodeUrl,
    onProgressUpdate: console.log,
  })
})()
// 上传
;(async () => {
  await ci.upload({
    project,
    version,
    desc,
    setting: uploadParams,
    onProgressUpdate: console.log,
  })
})()

/**
 * 获取node命令行参数
 * @param {array} options 命令行数组
 */
function getEnvParams(options) {
  const envParams = {}
  // 从第三个参数开始,是自定义参数
  for (let i = 2, len = options.length; i < len; i++) {
    const arg = options[i].split('=')
    envParams[arg[0]] = arg[1]
  }
  return envParams
}
