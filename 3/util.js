const users = []; // TODO(quinonez): This will be removed

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
  // TODO(quinonez): this logic will be on the user service
  const user = users.find(user => user.login === login);
  if (user && user.password === password) {
    next();
  } else {
    res.status(401).json('Credentials error');
  }
}

module.exports = {errorResponse, getAutoSuggestUsers, validateLogin};
