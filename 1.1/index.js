const readline = require('readline');

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

interface.on('line', (res) => {
  console.log(res.split('').reverse().join(''));
});
