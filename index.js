const inquirer = require('inquirer')
const db = require('./db')

module.exports.add = (title) => {
  // 1. 读取之前的任务
  const list = db.read()
  // 2. 添加一个任务
  list.push({ title, done: false })
  // 3. 存储任务到文件
  db.write(list)

  // option中，flag： a -- 打开并添加， a+ -- 打开并添加，如果不存在则默认创建一个， r -- 只读， w -- 只写
  // fs.readFile(dbPath, {flag: 'a+'}, (error, data) => {
  //   let list
  //   try {
  //     list = JSON.parse(data.toString())
  //   } catch (error) {
  //     list = []
  //   }
  //   console.log(list)
  //   const task = { title, done: false }
  //   list.push(task)
  //   const string = JSON.stringify(list)
  //   console.log(list)
  // })
  // const data = fs.readFileSync(dbPath, {flag: 'a+'})
  // let list
  // try {
  //   list = JSON.parse(data.toString())
  // } catch (error) {
  //   list = []
  // }
  // console.log(list)
  // const task = { title, done: false }
  // list.push(task)
  // const string = JSON.stringify(list)
  // console.log(list)
  // fs.writeFileSync(dbPath, string)

}

module.exports.clear = async () => {
  db.write([])
}

module.exports.showAll = async () => {
  const list = db.read()
  // list.map((task, index) => console.log(`${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`))
  inquirer
    .prompt({
      type: 'list',
      name: 'index',
      message: '请选择你想操作的任务',
      choices: [
        { name: '退出', value: '-1' },
        ...list.map((task, index) => ({
          name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`,
          value: index.toString()
        })),
        { name: '+ 创建任务', value: '-2' },
      ],
    })
    .then((answer) => {
      const index = parseInt(answer.index)
      if(index >= 0) {
        inquirer.prompt({
          type: 'list',
          name: 'action',
          message: '请选择操作',
          choices: [
            {name: '退出', value: 'quit'},
            {name: '已完成', value: 'markAsDone'},
            {name: '未完成', value: 'markAsUnDone'},
            {name: '修改任务', value: 'updateTitle'},
            {name: '删除', value: 'remove'},
          ]
        })
          .then(answerChild => {
            switch (answerChild.action) {
              case 'markAsDone':
                break;
              case 'markAsUnDone':
                break;
              case 'updateTitle':
                break;
              case 'remove':
                break;
            }
          })
      }
      if(index === -2) {
        // 创建任务
        console.log('创建任务')
      }
    });
}