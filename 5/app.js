const express = require('express');
const bodyParser = require('body-parser');
const {userController, groupController} = require('./controllers');
const {logger} = require('./config');

const app = express();

const port = 3000;

app.set('x-powered-by', false);
app.use(bodyParser.json());

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use((req, res, next)=> {
  console.log('========================');
  console.log(`Time: ${new Date()}`);
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

app.use('/', userController, groupController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

process.on('unhandledRejection', (err)=> {
  logger.error('Unhandled Rejection!', err);
  process.exit(1);
});


process.on('uncaughtException', (err)=> {
  logger.error("Uncaught exception!", err);
  process.exit(1);
});
