const fs = require('fs');
const csv=require('csvtojson');

const readStream = fs.createReadStream('./nodejs-hw1-ex1.csv', 'utf8');
const writeStream = fs.createWriteStream('./nodejs-hw1-ex1.txt', 'utf8');

csv().fromStream(readStream).subscribe((line) => {
  writeStream.write(`${JSON.stringify(line)}\r`);
}, (err) => {
  console.error('Error:', err);
}, () => {
  console.log('done.');
  writeStream.end();
});
