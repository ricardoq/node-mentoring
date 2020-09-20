var Pg = require('pg').Client;

module.exports = class UserModel {
  connectionString = 'postgres://ygrxizjg:oDc6XCH2PbJRGS-T9HB6r65-tsgac3__@lallah.db.elephantsql.com:5432/ygrxizjg';

  constructor() {
    this.pg = new Pg(this.connectionString);
    this.pg.connect();
    this.authenticateConnection().then(res => console.log(res.rows[0].message));
  }

  async authenticateConnection() {
    const res = await this.pg
                          .query('SELECT $1::text as message'
                                , ['Database connection succesful!']);
    return res;
  }

  async getLoggedUser(login, password) {
    const res = await this.pg
          .query('SELECT id, login, password FROM users WHERE login = $1 AND password = $2',
                  [login, password]
                );
    return res.rows;
  }

  async getUsers(userSearch, limit) {
    const limitStatement = limit ? `LIMIT ${limit}` : '';
    const res = await this.pg
          .query(`SELECT * FROM users WHERE login LIKE '${userSearch}%' ${limitStatement}`);
    return res.rows;
  }

  async getUser(id) {
    const res = await this.pg
          .query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows;
  }

  async postNewUser(newUser) {
    const res = await this.pg
          .query('INSERT INTO users (login, password, age, isDeleted) VALUES ($1, $2, $3, FALSE) RETURNING *',
                  [newUser.login, newUser.password, newUser.age]
                );
    return res.rows;
  }

  async updateUser(changesUser) {
    await this.pg
          .query('UPDATE users SET (login, password, age) = ($1, $2, $3) WHERE id = $4',
                 [changesUser.login, changesUser.password, changesUser.age, changesUser.id]);
    return this.getUser(changesUser.id);
  }

  async deleteUser(id) {
    await this.pg
          .query('UPDATE users SET isDeleted = TRUE WHERE id = $1', [id]);
    return this.getUser(id);
  }

  async addUsersToGroup(groupId, userId) {
    const groupLink = await this.pg
          .query('INSERT INTO users_groups (users_id, groups_id) VALUES ($1, $2) RETURNING *'
                , [userId, groupId]);
    return groupLink[0];
  }
};
