require('jest-sinon');
const express = require("express");
const groupController = require("./group.controller");
const request = require("supertest");
const {mockGroupList} = require('../mock_data/group.service.mock');

jest.mock('../util', () => ({
  jwtChecker: jest.fn((req, res, next) => next()),
  permissionsEnum: {
    READ: 'READ',
    WRITE: 'WRITE',
    DELETE: 'DELETE',
    SHARE: 'SHARE',
    UPLOAD_FILES: 'UPLOAD_FILES',
  }
}));
jest.mock('../services', () => {
  const {mockGroupList} = require('../mock_data/group.service.mock');
  const mockPromise = (responseValue, shouldFail = false) => () => new Promise((resolve, reject) => {
    if (!shouldFail) {
      resolve(responseValue);
      return
    }
    reject('error message');
  });

  return {
    GroupService: function() {
      return {
        getGroups: jest.fn(mockPromise(mockGroupList)),
        addGroup: jest.fn(mockPromise(mockGroupList[0])),
        updateGroup: jest.fn(mockPromise(mockGroupList[0])),
        findGroup: jest.fn(mockPromise(mockGroupList[0])),
        deleteGroup: jest.fn(mockPromise(mockGroupList[0])),
      };
    },
  };
});


describe('User controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use("/", groupController);
  });

  it("GET /group", async () => {
    const { body } = await request(app).get("/group");
    expect(body).toEqual(mockGroupList);
  });

  it("POST /group", async () => {
    const req = mockGroupList[0];
    delete req.id;
    const { body } = await request(app).post('/group', req);
    expect(body).toEqual(mockGroupList[0]);
  });

  it("PATCH /group", async () => {
    const req = mockGroupList[0];
    const { body } = await request(app).patch('/group', req);
    expect(body).toEqual(mockGroupList[0]);
  });

  it("GET /group/123", async () => {
    const id = 123;
    const { body } = await request(app).get(`/group/${id}`);
    expect(body).toEqual(mockGroupList[0]);
  });

  it("DELETE /group/123", async () => {
    const id = 123;
    const { body } = await request(app).delete(`/group/${id}`);
    expect(body).toEqual('Item deleted');
  });
});
