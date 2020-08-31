const Sequelize = require("sequelize");

module.exports = class UserModel {
  constructor() {
    this.sequelize = new Sequelize(
      "postgres://ygrxizjg:oDc6XCH2PbJRGS-T9HB6r65-tsgac3__@lallah.db.elephantsql.com:5432/ygrxizjg"
    );
    this.authenticateConnection();
  }

  authenticateConnection() {
    this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });
  }

  // TODO(quinonez): add queries here.
};
