const fs = require('fs')
const manifestPath = process.env.UNI_INPUT_DIR + '/manifest.json'
const pagesJsonPath = process.env.UNI_INPUT_DIR + '/pages.json'
let Manifest = fs.readFileSync(manifestPath, { encoding: 'utf-8' })
let pagesJson = fs.readFileSync(pagesJsonPath, { encoding: 'utf-8' })
const appJson = fs.readFileSync(
  process.env.UNI_INPUT_DIR + `/apps/${process.env.UNI_PLATFORM}/${process.env.VUE_APP_OWNER}.config.js`,
  {
    encoding: 'utf-8',
  }
)
fs.writeFileSync(process.env.UNI_INPUT_DIR + `/apps/index.config.js`, appJson, { flag: 'w' })
function replaceManifest(path, value) {
  const arr = path.split('.')
  const len = arr.length
  const lastItem = arr[len - 1]

  let i = 0
  const ManifestArr = Manifest.split(/\n/)

  for (let index = 0; index < ManifestArr.length; index++) {
    const item = ManifestArr[index]
    if (new RegExp(`"${arr[i]}"`).test(item)) ++i
    if (i === len) {
      const hasComma = /,/.test(item)
      ManifestArr[index] = item.replace(
        new RegExp(`"${lastItem}"[\\s\\S]*:[\\s\\S]*`),
        `"${lastItem}": ${value}${hasComma ? ',' : ''}`
      )
      break
    }
  }

  Manifest = ManifestArr.join('\n')
}
// 动态配置 appid
replaceManifest(`${process.env.UNI_PLATFORM}.appid`, `"${process.env.VUE_APP_ID}"`)
fs.writeFileSync(manifestPath, Manifest, { flag: 'w' })
module.exports = {
  lintOnSave: true,
  parallel: true, // 启用多进程打包
  configureWebpack: (config) => {
    config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = false
  },
  chainWebpack: (config) => {
    if (process.env.VUE_APP_ENV === 'production') {
      // 发行或运行时启用了压缩时会生效
      config.optimization.minimizer('terser').tap((args) => {
        const compress = args[0].terserOptions.compress
        // 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
        compress.drop_console = true
        compress.pure_funcs = [
          '__f__', // App 平台 vue 移除日志代码
          'console.log', // 可移除指定的 console 方法
          'console.info', // 可移除指定的 console 方法
        ]
        return args
      })
    }
  },
}
