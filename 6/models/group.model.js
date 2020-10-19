const Pg = require('pg').Client;
const {connectionString} = require('../util');

module.exports = class GroupModel {

  constructor() {
    this.pg = new Pg(connectionString);
    this.pg.connect();
    this.authenticateConnection().then(res => console.log(res.rows[0].message));
  }

  async authenticateConnection() {
    const res = await this.pg
                          .query('SELECT $1::text as message'
                                , ['Database connection succesful!']);
    return res;
  }

  async getGroups(limit) {
    const limitStatement = limit ? ` WHERE LIMIT ${limit}` : '';
    const res = await this.pg
          .query(`SELECT * FROM groups${limitStatement}`);
    return res.rows;
  }

  async getGroupById(groupID) {
    const res = await this.pg
          .query(`SELECT * FROM groups WHERE id = ${groupID}`);
    return res.rows;
  }

  async postGroup(newGroup) {
    const res = await this.pg
          .query('INSERT INTO groups (name, permissions) VALUES ($1, $2) RETURNING *',
                  [newGroup.name, newGroup.permissions]
                );
    return res.rows;
  }

  async updateGroup(changesUser) {
    const res = await this.pg
          .query('UPDATE groups SET (name, permissions) = ($1, $2) WHERE id = $3 RETURNING *',
                 [changesUser.name, changesUser.permissions, changesUser.id]);
    return res.rows;
  }

  async deleteGroup(id) {
    await this.pg
          .query('DELETE FROM groups WHERE id = $1', [id]);
    return this.getGroups();
  }
};
