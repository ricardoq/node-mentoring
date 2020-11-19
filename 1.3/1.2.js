// const fs = require('fs');
import fs from 'fs';
// import {csv} from 'csvtojson';
import pkg from 'csvtojson';
const {csv} = pkg;

class ProcessCSV {
  constructor(fileName = 'nodejs-hw1-ex1') {
    // this.csv = new csvtojson.csv();
    this.readStream = fs.createReadStream(`./${fileName}.csv`, 'utf8');
    this.writeStream = fs.createWriteStream(`./${fileName}.txt`, 'utf8');
  }

  genTxt(done, error) {
    csv().fromStream(this.readStream).subscribe(line => {
      this.writeStream.write(`${JSON.stringify(line)}\r`);
    },(err) => {
      error();
      console.error("Error:", err);
    },() => {
      done();
      this.writeStream.end();
    });
  }
}

export default ProcessCSV;
