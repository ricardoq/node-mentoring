const {users = []} = require('./users');

const errorResponse = (schemaErrors) => {
  const errors = schemaErrors.map((error) => {
    let {path, message} = error;
    return {path, message};
  });
  return {
    status: 'failed',
    errors,
  };
}

const getAutoSuggestUsers = (loginSubstring = '', limit = []) => {
  return limit.filter(user => user.login.startsWith(loginSubstring));
};

const validateLogin = (req, res, next) => {
  const {login = '', password = ''} = req.headers;
  const user = users.find(user => user.login === login);
  if (user && user.password === password) {
    next();
  } else {
    res.status(401).json('Credentials error');
  }
}

module.exports = {errorResponse, getAutoSuggestUsers, validateLogin};
