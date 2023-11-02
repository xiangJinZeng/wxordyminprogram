#!/usr/bin/env zx
import { $, chalk } from 'zx'
import inquirer from 'inquirer'
let [path1, path2, fileName, env = '', appId = '', owner = '', mode = '',platform = 'mp-weixin', delPos = ''] = process.argv
console.log('path1, path2, fileName: ', path1, path2, fileName);
console.log('env',env)
console.log('appId',appId)
console.log('owner',owner)
console.log('mode',mode)
console.log('platform',platform)
const BUILD_COMMAND = {
  开发: 'dev:watch',
  '调试-监视': 'test:watch',
  '构建-打包-压缩': 'build',
}
// 微信小程序
const APPID_MAP_WEIXIN = {
  '微信小程序名称1': { id: 'wxAPPID1',label:'微信小程序名称1',owner: 'wxname1' },
  '微信小程序名称2': { id: 'wxAPPID2',label:'微信小程序名称2',owner: 'wxname2' },
}
// 抖音小程序
const APPID_MAP_TOUTIAO = {
  '抖音小程序名称1': { id: 'dyAPPID1',label:'抖音小程序名称1',owner: 'dyname1' },
  '抖音小程序名称2': { id: 'dyAPPID2',label:'抖音小程序名称2',owner: 'dyname2' },
}
let APPID_MAP = platform === 'mp-toutiao' ? APPID_MAP_TOUTIAO : APPID_MAP_WEIXIN
let name = appId && Object.values(APPID_MAP).find(({id}) => id === appId).label
const ENV_ITEM = {
  开发环境: 'development',
  测试环境: 'test',
  准生产环境: 'staging',
  生产环境: 'production',
}
const platformList = {
  微信小程序: 'mp-weixin',
  抖音小程序: 'mp-toutiao',
}
if (!env && !appId && !owner && !mode ) {
  const runMode = await inquirer.prompt([
    { 
      type: 'list',
      name: 'value',
      message: '请选择运行的方式',
      choices: Object.keys(BUILD_COMMAND),
    },
  ])
  const runEnv = await inquirer.prompt([
    {
      type: 'list',
      name: 'value',
      message: '请选择环境',
      choices: Object.keys(ENV_ITEM),
    },
  ])
  const choosePlatform = await inquirer.prompt([
    {
      type: 'list',
      name: 'value',
      message: '请选择发布平台',
      choices: Object.keys(platformList),
    },
  ])
  platform = platformList[choosePlatform.value]
  if(platform === 'mp-toutiao'){
    APPID_MAP = APPID_MAP_TOUTIAO
  }
  const chooseWeapp = await inquirer.prompt([
    {
      type: 'list',
      name: 'value',
      message: '请选择小程序',
      choices: Object.keys(APPID_MAP),
    },
  ])
  
  mode = BUILD_COMMAND[runMode.value]
  env = ENV_ITEM[runEnv.value]
  const { id = 'wxAPPID1', owner:ownerType = 'dyname1' } = APPID_MAP[chooseWeapp.value]
  appId = id
  owner = ownerType
  name = `${runMode.value}-${runEnv.value}`
}
console.log(chalk.red(`启动中,请稍等...`))
await $`name=${name} appEnv=${env} owner=${owner} appId=${appId} dir=dist/${platform}/${appId} platform=${platform} npm run ${mode}`

console.log(chalk.green(`启动成功`))

