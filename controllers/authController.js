const { login, register } = require("../repository/auth");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { userData, accessToken, error } = await login(email, password);

  if (error) {
    res.json(error);
    res.status("500");
  }

  const user = { ...userData, jwt: accessToken };
  res.json(user);
  res.status("200");
};

exports.register = async (req, res) => {
  const { body } = req;
  const registered = await register(body);
  const { errors } = registered;
  if (errors) {
    res.json(registered);
    res.status("400");
  } else {
    res.status("200");
    res.json(registered);
  }
};
