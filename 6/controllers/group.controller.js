const express = require('express');
const {permissionsEnum} = require('../util');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const {logger} = require('../config');
const {GroupService} = require('../services');
const {GroupModel} = require('../models');

const groupController = express.Router();
const groupService = new GroupService(GroupModel);

const newGroupSchema = Joi.object().keys({
  name: Joi.string()
           .alphanum(),
  permissions: Joi.array()
                  .items(
                    Joi.string().valid(...Object.values(permissionsEnum))
                  ),
});

const updateGroupSchema = Joi.object().keys({
  id: Joi.number().required(),
  name: Joi.string().alphanum(),
  permissions: Joi.array()
                  .items(
                    Joi.string().valid(...Object.values(permissionsEnum))
                  ),
});

groupController.get('/group/:id', (req, res) => {
  const {id = ''} = req.params;
  groupService.findGroup(id)
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

groupController.get('/group', (req, res) => {
  groupService.getGroups()
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

groupController.post('/group', validator.body(newGroupSchema), (req, res) => {
  const {body} = req;
  const newGroup = {
    ...body,
  };

  groupService.addGroup(newGroup)
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

groupController.patch('/group',
                     validator.body(updateGroupSchema),
                     (req, res) => {
  const {body} = req;

  groupService.updateGroup(body)
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

groupController.delete('/group/:id', (req, res) => {
  const {id = ''} = req.params;
  groupService.deleteGroup(id)
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

module.exports = groupController;
