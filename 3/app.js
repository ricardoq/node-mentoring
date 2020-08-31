const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./controllers');

const app = express();

const port = 3000;

app.set('x-powered-by', false);
app.use(bodyParser.json());

app.use((req, res, next)=> {
  console.log('========================');
  console.log(`Time: ${new Date()}`);
  console.log(`Request: ${req.method} ${req.url} ${req.path}`);
  next();
});

app.use('/', userController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
