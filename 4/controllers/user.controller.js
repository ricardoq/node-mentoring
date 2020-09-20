const express = require('express');
const {validateLogin} = require('../util');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const {UserService} = require('../services');
const {UserModel} = require('../models');

const userController = express.Router();
const userService = new UserService(UserModel);

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
  userService.getAutoSuggestUsers(login)
            .then(response => res.json(response))
            .catch(error => res.status(500).json(`Error: ${error}`));
});

userController.post('/user', validateLogin(userService), validator.body(newUserSchema), (req, res) => {
  const {body} = req;
  const newUser = {
    ...body,
    isDeleted: false,
  };
  userService.addUser(newUser)
             .then(response => res.json(response))
             .catch(error => res.status(500).json(`Error: ${error}`));
});

userController.patch('/user',
                     validateLogin(userService),
                     validator.body(updateUserSchema),
                     (req, res) => {
  const {body} = req;

  userService.updateUser(body)
             .then(response => res.json(response))
             .catch(error => res.status(500).json(`Error: ${error}`));
});

userController.get('/user/:id', (req, res) => {
  const {id = ''} = req.params;
  userService.findUser(id)
            .then(response => {
              if (response) {
                res.json(response)
              } else {
                res.status(404).json('No user found');
              }
            })
            .catch(error => res.status(500).json(`Error: ${error}`));
});

userController.delete('/user/:id', (req, res) => {
  const {id = ''} = req.params;
  userService.deleteUser(id)
              .then(response => {
                if (response) {
                  res.json('Item deleted');
                } else {
                  res.status(404).json('No user found');
                }
              })
              .catch(error => res.status(500).json(`Error: ${error}`));
});

module.exports = userController;
