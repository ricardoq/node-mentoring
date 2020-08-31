const { v4: uuidv4 } = require('uuid');
const express = require('express');
const {getAutoSuggestUsers, errorResponse, validateLogin} = require('../util');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const {UserService} = require('../services');
const {UserModel} = require('../models');

const userController = express.Router();
const userService = new UserService(UserModel, {getAutoSuggestUsers, errorResponse});

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

userController.get('/user', validator.query(autosuggestCriteria), (req, res) => {
  const {login} = req.query;
  const filteredUsers = login ? getAutoSuggestUsers(login, users) : users;

  res.json(filteredUsers.filter(u => !u.isDeleted));
});

userController.post('/user', validateLogin, validator.body(newUserSchema), (req, res) => {
  const {body} = req;
  const newUser = {
    ...body,
    id: uuidv4(),
    isDeleted: false,
  };
  users.push(newUser);
  res.json(newUser);
});

userController.patch('/user', validateLogin,validator.body(updateUserSchema), (req, res, next) => {
  const {body} = req;
  let userIndex = users.findIndex(user => user.id === body.id);

  if (userIndex === -1) {
    res.json(errorResponse([{path: 'id', message: 'No user found'}]));
  } else {
    users[userIndex] = {
      ...users[userIndex],
      ...body,
    };

    res.json(users[userIndex]);
  }
});

userController.get('/user/:id', (req, res) => {
  const {id = ''} = req.params;
  const userIndex = users.find(i => i.id === id && !i.isDeleted);
  console.log(userIndex);
  if (userIndex) {
    res.json(userIndex);
  } else {
    res.status(404).json('No user found');
  }
});

userController.delete('/user/:id', (req, res) => {
  const {id = ''} = req.params;
  let userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    res.status(404).json('No user found');
  } else {
    users[userIndex].isDeleted = true;
    res.json(users.filter(u => !u.isDeleted));
  }
});

module.exports = userController;
