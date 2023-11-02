/*
 * @Description:
 * @Author: langjitianya-king
 * @Date: 2023-11-01 13:52:10
 * @LastEditTime: 2023-11-01 13:52:10
 * @LastEditors: langjitianya-king
 * @Usage:
 */
const config = require('../apps/index.config.js')
// 编译环境
const env = process.env.VUE_APP_ENV
//注入自定义环境配置信息
config.APP_ENV = process.env.VUE_APP_ENV
config.APP_OWNER = process.env.VUE_APP_OWNER
config.env = process.env
// 图片地址
const imgUrls = {
  development: config.$devImgUrl,
  test: config.$testImgUrl,
  staging: config.$standardImgUrl,
  production: config.$prodImgUrl,
}
// 请求地址
const baseUrls = {
  development: config.$devBaseUrl,
  test: config.$testBaseUrl,
  staging: config.$standardBaseUrl,
  production: config.$prodBaseUrl,
}
let $platform_type = 'wechat'
// #ifdef MP-TOUTIAO
$platform_type = 'douyin'
// #endif
// 固定默认配置
const baseConfig = {
  //远程图片地址
  $imageUrl: imgUrls[env],
  //请求地址
  $baseUrl: baseUrls[env],
  //目标平台
  $platform_type,
  // 小程序appid
  $appId: process.env.VUE_APP_ID,
}
// 打印
if (env !== 'prod') {
  console.log('process.env', process.env)
  console.log('process.env.APP_ENV', process.env.VUE_APP_ENV)
  console.log('process.env.APP_OWNER', process.env.VUE_APP_OWNER)
  console.log('process.env.UNI_PLATFORM', process.env.UNI_PLATFORM)
  console.log('config', { ...baseConfig, ...config })
}

module.exports = { ...baseConfig, ...config }
