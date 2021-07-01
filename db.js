const fs = require('fs')
const path = require('path')
const homedir = require('os').homedir() // 系统home目录
const home = process.env.HOME || homedir // 系统环境变量的home， 优先使用变量，因为是用户设置的
const dbPath = path.join(home, '.todo')

const db = {
  read(path = dbPath) {
    // option中，flag： a -- 打开并添加， a+ -- 打开并添加，如果不存在则默认创建一个， r -- 只读， w -- 只写
    const data = fs.readFileSync(path, {flag: 'a+'})
    let list
    try {
      list = JSON.parse(data.toString())
    } catch (error) {
      list = []
    }
    return list
  },
  write(list, path = dbPath) {
    const string = JSON.stringify(list)
    fs.writeFileSync(path, string)
  },
}

module.exports = db