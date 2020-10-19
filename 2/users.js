const { v4: uuidv4 } = require('uuid');

exports.users = [{
  id: uuidv4(),
  login: 'login',
  password: 'password',
  age: 18,
  isDeleted: false,
}, {
  id: uuidv4(),
  login: 'user2',
  password: 'password2',
  age: 15,
  isDeleted: false,
}, {
  id: uuidv4(),
  login: 'user3',
  password: 'password3',
  age: 24,
  isDeleted: false,
}, {
  id: uuidv4(),
  login: 'user4',
  password: 'password4',
  age: 30,
  isDeleted: false,
}, {
  id: uuidv4(),
  login: 'user5',
  password: 'password5',
  age: 25,
  isDeleted: false,
}];
