const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const {users = []} = require('./users');
const {getAutoSuggestUsers, errorResponse, validateLogin} = require('./util');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({})

const app = express();
const router = express.Router();

const autosuggestCriteria = Joi.object().keys({
  login: Joi.string().alphanum(),
});

const newUserSchema = Joi.object().keys({
  login: Joi.string().alphanum().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]/).required(),
  age: Joi.number().integer().min(18).max(130).required(),
});

const updateUserSchema = Joi.object().keys({
  id: Joi.string().required(),
  login: Joi.string().alphanum(),
  password: Joi.string().regex(/^[a-zA-Z0-9]/),
  age: Joi.number().integer().min(18).max(130),
});

const port = 3000;

app.set('x-powered-by', false);
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

app.use((req, res, next)=> {
  console.log('========================');
  console.log(`Time: ${new Date()}`);
  console.log(`Request: ${req.method} ${req.url} ${req.path}`);
  next();
});

router.get('/user', validator.query(autosuggestCriteria), (req, res) => {
  const {login} = req.query;
  const filteredUsers = login ? getAutoSuggestUsers(login, users) : users;

  res.json(filteredUsers.filter(u => !u.isDeleted));
});

router.post('/user', validateLogin, validator.body(newUserSchema), (req, res) => {
  const {body} = req;
  users.push({
      ...body,
      id: uuidv4(),
      isDeleted: false,
    });
    res.json(users.filter(u => !u.isDeleted));
});

router.patch('/user', validateLogin,validator.body(updateUserSchema), (req, res, next) => {
  const {body} = req;
  let userIndex = users.findIndex(user => user.id === body.id);

  if (userIndex === -1) {
    res.json(errorResponse([{path: 'id', message: 'No user found'}]));
  } else {
    users[userIndex] = {
      ...users[userIndex],
      ...body,
    };

    res.json(users.filter(u => !u.isDeleted));
  }
});

router.get('/user/:id', (req, res) => {
  const {id = ''} = req.params;
  const user = users.find(i => i.id === id && !i.isDeleted);
  res.json(user);
});

router.delete('/user/:id', (req, res) => {
  const {id = ''} = req.params;
  let userIndex = users.findIndex(user => user.id === id);
  users[userIndex].isDeleted = true;

  res.json(users.filter(u => !u.isDeleted));
});


app.use('/', router);
