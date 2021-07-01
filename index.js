const inquirer = require('inquirer')
const db = require('./db')
const ACTION_CHOICE = [
  {name: '退出', value: 'quit'},
  {name: '已完成', value: 'markAsDone'},
  {name: '未完成', value: 'markAsUnDone'},
  {name: '修改任务', value: 'updateTitle'},
  {name: '删除', value: 'remove'},
]

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
  printTasks(list)
}

const markAsDone = (list, index) => {
  list[index].done = true
  db.write(list)
}

const markAsUnDone = (list, index) => {
  list[index].done = false
  db.write(list)
}

const updateTitle = (list, index) => {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: '新的标题',
      default: list[index].title
    })
    .then(answerTitle => {
      list[index].title = answerTitle.title
      db.write(list)
    })
}

const removeTask = (list, index) => {
  list.splice(index,1)
  db.write(list)
}

const askForAction = (list, index) => {
  const ACTIONS = {
    markAsDone,
    markAsUnDone,
    updateTitle,
    removeTask
  }
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: '请选择操作',
      choices: ACTION_CHOICE
    })
    .then(answerChild => {
      const action = ACTIONS[answerChild.action]
      action && action(list, index)
    })
}

const asiForCreateTask = (list) => {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: '输入任务标题',
    })
    .then(answerTitle => {
      list.push({title: answerTitle.title, done: false})
      db.write(list)
    })
}

const printTasks = (list) => {
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
        askForAction(list, index)
      }
      if(index === -2) {
        // 创建任务
        asiForCreateTask(list)
      }
    })
}