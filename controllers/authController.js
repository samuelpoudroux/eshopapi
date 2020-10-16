const { login, register } = require('../repository/auth');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const access = await login(email, password);
  const { error } = access;
  if (error) {
    res.json(access);
    res.status('500');
  }
  res.status('200');
  res.json(access);
};

exports.register = async (req, res) => {
  const { body } = req;
  const registered = await register(body);
  const { errors } = registered;
  console.log('errors', registered);
  if (errors) {
    res.json(registered);
    res.status('400');
  } else {
    res.status('200');
    res.json(registered);
  }
};
