const connectionString = 'postgres://ygrxizjg:oDc6XCH2PbJRGS-T9HB6r65-tsgac3__@lallah.db.elephantsql.com:5432/ygrxizjg';

const permissionsEnum = {
  READ: 'READ',
  WRITE: 'WRITE',
  DELETE: 'DELETE',
  SHARE: 'SHARE',
  UPLOAD_FILES: 'UPLOAD_FILES',
}

const validateLogin = (userService) => (req, res, next) => {
  const {login = '', password = ''} = req.headers;
  userService.isLogged(login, password).then((user) => {
    if (user) {
      next();
    } else {
      res.status(401).json('Credentials error');
    }
  }).catch((error) => {
    res.status(500).json(`Error: ${error}`);
  });
}

module.exports = { validateLogin, connectionString, permissionsEnum};
