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

module.exports = { validateLogin};
