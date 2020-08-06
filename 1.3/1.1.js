// const readline = require('readline');
import readline from 'readline';

function ReadString() {
  console.log('Add a string in order to revert: ');
  const interfaceRL = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  interfaceRL.on('line', (res) => {
    console.log(res.split('').reverse().join(''));
  });
}

export default ReadString;
