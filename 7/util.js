const jwt = require('jsonwebtoken');

const connectionString = 'postgres://ygrxizjg:oDc6XCH2PbJRGS-T9HB6r65-tsgac3__@lallah.db.elephantsql.com:5432/ygrxizjg';
const secret = 'THE_PIE_IS_A_LIE';

const permissionsEnum = {
  READ: 'READ',
  WRITE: 'WRITE',
  DELETE: 'DELETE',
  SHARE: 'SHARE',
  UPLOAD_FILES: 'UPLOAD_FILES',
}

const jwtChecker = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json(`No token provided`);
  }

  return jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json(`Failed credentials`);
    }

    return next();
  });
}

module.exports = { connectionString, permissionsEnum, secret, jwtChecker};
