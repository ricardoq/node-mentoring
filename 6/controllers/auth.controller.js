const express = require('express');
const {UserModel} = require('../models');
const {secret} = require('../util');
const {UserService} = require('../services');

const jwt = require('jsonwebtoken');

const authController = express.Router();
const userService = new UserService(UserModel);

authController.post('/login', async (req, res) => {
  const {login, password} = req.body;
  const users = await userService.getAutoSuggestUsers(login, 1);

  if (!users[0] || users[0].password !== password) {
    return res.status(401).json(`Wrong credentials`);
  }

  const payload = {id: users[0].id, login: users[0].login};
  const token = jwt.sign(payload, secret, {expiresIn: 120});

  return res.send(token);
});

module.exports = authController;
