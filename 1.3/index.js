import ReadString from './1.1.js';
import ProcessCSV from './1.2.js';

const process = new ProcessCSV();

process.genTxt(succes => console.log('success'), error => console.error(error));
ReadString();
