require('jest-sinon');
const express = require("express");
const userController = require("./user.controller");
const request = require("supertest");
const {mockUserList} = require('../mock_data/user.service.mock');

jest.mock('../util', () => ({
  jwtChecker: jest.fn((req, res, next) => next()),
}));
jest.mock('../services', () => {
  const {mockUserList} = require('../mock_data/user.service.mock');
  const mockPromise = (responseValue, shouldFail = false) => () => new Promise((resolve, reject) => {
    if (!shouldFail) {
      resolve(responseValue);
      return
    }
    reject('error message');
  });

  return {
    UserService: function() {
      return {
        getAutoSuggestUsers: jest.fn(mockPromise(mockUserList)),
        addUser: jest.fn(mockPromise(mockUserList[0])),
        updateUser: jest.fn(mockPromise(mockUserList[0])),
        findUser: jest.fn(mockPromise(mockUserList[0])),
        deleteUser: jest.fn(mockPromise(mockUserList[0])),
        addUsersToGroup: jest.fn(mockPromise(mockUserList[0])),
      };
    },
  };
});


describe('User controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use("/", userController);
  });

  it("GET /user", async () => {
    const { body } = await request(app).get("/user");
    expect(body).toEqual(mockUserList);
  });

  it("POST /user", async () => {
    const req = mockUserList[0];
    delete req.isdeleted;
    delete req.id;
    const { body } = await request(app).post('/user', req);
    expect(body).toEqual(mockUserList[0]);
  });

  it("PATCH /user", async () => {
    const req = mockUserList[0];
    delete req.isdeleted;
    const { body } = await request(app).patch('/user', req);
    expect(body).toEqual(mockUserList[0]);
  });

  it("GET /user/123", async () => {
    const id = 123;
    const { body } = await request(app).get(`/user/${id}`);
    expect(body).toEqual(mockUserList[0]);
  });

  it("DELETE /user/123", async () => {
    const id = 123;
    const { body } = await request(app).delete(`/user/${id}`);
    expect(body).toEqual('Item deleted');
  });

  it("GET /user/123/group/456", async () => {
    const idUser = 123;
    const idGroup = 456;
    const { body } = await request(app).get(`/user/${idUser}/group/${idGroup}`);
    expect(body).toEqual(mockUserList[0]);
  });
});
