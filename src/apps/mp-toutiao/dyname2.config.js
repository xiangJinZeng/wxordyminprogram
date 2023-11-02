/*
 * @Description:此文件主要是用来配置不同小程序的图片、请求地址等，需要啥自己可以添加啥
 * @Author: langjitianya-king
 * @Date: 2023-11-01 13:52:10
 * @LastEditTime: 2023-11-01 13:52:10
 * @LastEditors: langjitianya-king
 * @Usage:
 */
// 请注意：实际appid需要替换成自己的小程序appid，我这个只是个demo
const config = {
  // 开发
  $devImgUrl: 'https://youban2.jqtest.mopon.cn/toc-static/miniprogram/', //远程图片地址
  $devBaseUrl: 'https://youban2.jqtest.mopon.cn/toc-dev-wxmp', //开发环境
  $devAppId: 'dyAPPID2', //开发环境小程序的appid

  // 测试
  $testImgUrl: 'https://youban2.jqtest.mopon.cn/toc-static/miniprogram/', //远程图片地址
  $testBaseUrl: 'https://youban2.jqtest.mopon.cn/toc-wxmp', //测试环境
  $testAppId: 'dyAPPID2', //测试环境小程序的appid

  // 准生产
  $standardImgUrl: 'https://toc-xcx.pre.mopon.cn/static/miniprogram/', //远程图片地址
  $standardBaseUrl: 'https://toc-xcx.pre.mopon.cn', //准生产环境
  $standardProdAppId: 'dyAPPID2', //准生产环境小程序的appid

  // 生产
  $prodImgUrl: 'https://toc-resource.skovriver.com/miniprogram/', //远程图片地址
  $prodBaseUrl: 'https://toc-cgi.skovriver.com', //生产环境
  $prodAppId: 'dyAPPID2', //生产小程序的appid

  desc: `1、首页功能更新
        2、其他已知问题优化`,
}
module.exports = config
