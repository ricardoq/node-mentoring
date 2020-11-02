const express = require('express');
const {jwtChecker} = require('../util');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const {UserService} = require('../services');
const {UserModel} = require('../models');
const {logger} = require('../config');

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

userController.get('/user', validator.query(autosuggestCriteria), jwtChecker, (req, res) => {
  const {login} = req.query;
  userService.getAutoSuggestUsers(login)
            .then(response => res.json(response))
            .catch(error => {
                logger.error({
                  url: req.url,
                  method: req.method,
                  message: error.toString(),
                  params: req.params,
                  body: req.body
                });
                res.status(500).json(`Error: ${error}`)
              });
});

userController.post('/user',
                    validator.body(newUserSchema),
                    jwtChecker,
                    (req, res) => {
  const {body} = req;
  const newUser = {
    ...body,
    isDeleted: false,
  };
  userService.addUser(newUser)
             .then(response => res.json(response))
             .catch(error => {
                logger.error({
                  url: req.url,
                  method: req.method,
                  message: error.toString(),
                  params: req.params,
                  body: req.body
                });
                res.status(500).json(`Error: ${error}`)
              });
});

userController.patch('/user',
                     validator.body(updateUserSchema),
                     jwtChecker,
                     (req, res) => {
  const {body} = req;

  userService.updateUser(body)
             .then(response => res.json(response))
             .catch(error => {
                logger.error({
                  url: req.url,
                  method: req.method,
                  message: error.toString(),
                  params: req.params,
                  body: req.body
                });
                res.status(500).json(`Error: ${error}`)
              });
});

userController.get('/user/:id', jwtChecker, (req, res) => {
  const {id = ''} = req.params;
  userService.findUser(id)
            .then(response => {
              if (response) {
                res.json(response)
              } else {
                res.status(404).json('No user found');
              }
            })
            .catch(error => {
              logger.error({
                  url: req.url,
                  method: req.method,
                  message: error.toString(),
                  params: req.params,
                  body: req.body
                });
              res.status(500).json(`Error: ${error}`)
            });
});

userController.delete('/user/:id', jwtChecker, (req, res) => {
  const {id = ''} = req.params;
  new Error('error');
  userService.deleteUser(id)
              .then(response => {
                if (response) {
                  res.json('Item deleted');
                } else {
                  res.status(404).json('No user found');
                }
              })
              .catch(error => {
                logger.error({
                  url: req.url,
                  method: req.method,
                  message: error.toString(),
                  params: req.params,
                  body: req.body
                });
                res.status(500).json(`Error: ${error}`)
              });
});

userController.get('/user/:idUser/group/:idGroup', jwtChecker, (req, res) => {
  const {idUser = '', idGroup = ''} = req.params;

  userService.addUsersToGroup(idGroup, idUser)
            .then(response => res.json(response))
            .catch(error => {
                logger.error({
                  url: req.url,
                  method: req.method,
                  message: error.toString(),
                  params: req.params,
                  body: req.body
                });
                res.status(500).json(`Error: ${error}`)
              });
});

module.exports = userController;
