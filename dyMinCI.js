/*
 * @Description: 此文件主要是用来自动上传抖音小程序到抖音开放平台的，避免了每次使用开发工具上传（我主要是配合Jenkins来使用的，有需要也可以）
 * @Author: langjitianya-king
 * @Date: 2023-11-02 13:52:10
 * @LastEditTime: 2023-11-02 13:52:10
 * @LastEditors: langjitianya-king
 * @Usage:用法：yarn run dyminci version=1.0.1 appid=dyAPPID1 buildenv=production
 */
const ci = require('tt-ide-cli')
const fs = require('fs')
const path = require('path')
const projectConfig = require('./src/config/index.js')
// 提示
console.log('============================== 开始发布 ==============================')
/**
 * version:版本号 上传操作必填
 * appid:应用id,测试人员有时需要切换应用Id
 * buildenv：构建环境，暂无作用，看自己需要，需要在代码逻辑特殊处理可传
 * platform: 构建平台
 * desc:版本描述  上传操作必填
 */
const {
  version = '',
  appid = '',
  buildenv = '',
  platform = 'mp-toutiao',
} = getEnvParams(process.argv)
let vers = version
// 抖音小程序版本号不能携带v
if (version && version.includes('v')) {
  vers = version.replace(/v/, '')
}
console.log('构建版本vers', vers)
console.log('构建appid', appid)
console.log('构建环境buildenv', buildenv)
console.log('发布平台platform', platform)
// 常量-版本描述
const { desc = '' } = projectConfig
// 项目文件路径
const filePath = `/dist/${platform}/${appid}`
// 项目绝对路径，用于上传项目
const projectPath = path.join(__dirname, filePath)
// 二维码储存路径
const qrcodeUrl = `./qrcode.jpg`
console.log('版本描述desc', desc)
console.log('dist文件路径filePath', filePath)
console.log('项目绝对路径projectPath', projectPath)
console.log('二维码路径qrcodeUrl', qrcodeUrl)
// 每次打包删除日志文件
fs.unlink('dyAppCI_log.txt', () => {})
// 项目是否打包
if (!fs.existsSync(path.join(__dirname, filePath))) {
  console.log(`Error：找不到小程序《${appid}》打包后的项目工程，请先打包!`)
  // 记录日志
  setLog('找不到项目工程！')
  // 结束脚本
  process.exit(1)
}
// 读取项目配置文件，做一下校验，因为命令提交不会管appid是否一致，都能正常提交
const config = JSON.parse(fs.readFileSync(path.join(__dirname, `${filePath}/project.config.json`), 'utf8'))
// 记录日志
setLog('开始上传...')
// 校验 appid 是否一致
if (config.appid === appid) {
  // 匹配，正常跑起来
  run()
} else {
  // 不匹配，中断
  console.log(
    `Error：本地 dist 文件中小程序包的 appid《${config.appid}》 与指定提交的 appid《${appid}》 不匹配，请重新打包对应的小程序!`
  )
  // 记录日志
  setLog(`本地 dist 文件中小程序包的 appid《${config.appid}》 与指定提交的 appid《${appid}》 不匹配`)
  // 结束脚本
  process.exit(1)
}

// 执行
async function run() {
  // 登录
  loginMethod()
}

// 选择登录方式
async function loginMethod() {
  try {
    // 登录
    await ci.loginByEmail({
      email: '1552692114@qq.com',
      password: 'Taijiu123456@',
    })
    // 提示
    console.log('登录成功，开始发布')
    // 开始上传
    upload()
  } catch (error) {
    // 登录有误
    console.log(error.message)
    // 记录日志
    setLog(`${error.message}！`)
  }
}
// 上传项目
async function upload() {
  try {
    // 提交上传
    await ci.upload({
      // 项目配置
      project: {
        // 项目地址
        path: projectPath,
      },
      qrcode: {
        format: 'imageFile', // imageSVG | imageFile | null | terminal
        // imageSVG 用于产出二维码 SVG
        // imageFile 用于将二维码存储到某个路径
        // terminal 用于将二维码在控制台输出
        // null 则不产出二维码
        output: qrcodeUrl, // 只在 imageFile 生效，填写图片输出绝对路径
        options: {
          small: false, // 使用小二维码，主要用于 terminal
        },
      },
      // 备注
      changeLog: desc,
      // 本次更新版本
      version: vers,
      // 是否上传后生成 sourcemap，推荐使用 true，否则开发者后台解析错误时将不能展示原始代码
      needUploadSourcemap: true,
    })
    // 上传结果
    console.log('======================================================================')
    console.log(
      `项目名称：${config.projectname}(${
        config.appid
      })\n项目版本：${vers}\n打包环境：${buildenv}\n上传结果：成功\n上传时间：${nowDate()}`
    )
    console.log('提示信息：测试、发包直接前往：小程序后台管理【版本管理】中扫码体验、测试、发包！')
    console.log('======================================================================')
    // 记录日志
    setLog(`上传成功！`)
    // 结束脚本
    process.exit(0)
  } catch (error) {
    // 上传有误
    console.log(error.message)
    // 记录日志
    setLog(`${error.message}！`)
    // 是否是因为没有登录
    if (error.message.includes('重新登录')) {
      // 重新登录
      setTimeout(() => {
        loginMethod()
      }, 1000)
    } else {
      // 结束脚本
      process.exit(1)
    }
  }
}

// 日志记录
function setLog(msg) {
  // 文件名称
  const logFileName = 'dyMinCI_log.txt'
  // 创建日志文件
  if (!fs.existsSync(path.join(__dirname, logFileName))) {
    fs.writeFileSync(logFileName, '', 'utf-8')
  }
  // 写入进度
  fs.appendFileSync(
    logFileName,
    `【 ${nowDate()} 】- ${appid} - ${vers} - ${buildenv}:${
      config.projectname ? `【${config.projectname}】` : ' '
    }${msg}\n`,
    'utf-8'
  )
}

// 获取当前时间
function nowDate() {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (day >= 0 && day <= 9) {
    day = '0' + day
  }
  if (hour >= 0 && hour <= 9) {
    hour = '0' + hour
  }
  if (minute >= 0 && minute <= 9) {
    minute = '0' + minute
  }
  if (second >= 0 && second <= 9) {
    second = '0' + second
  }
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

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
