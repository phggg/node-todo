const program = require('commander')
const api = require('./index')

if(process.argv.length === 2) {
  // 说明用户直接运行 node cli.js
  return api.showAll()
}

program
  .option('-x, --xxx', 'show x')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');
program
  .command('add <taskName>')
  .description('添加一个任务')
  .action((word) => {
    api.add(word)
  });

program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api.clear()
  });

program.parse(process.argv);


// console.log('pizza details:');
// if (options.small) console.log('- small pizza size');
// if (options.pizzaType) console.log(`- ${options.pizzaType}`);