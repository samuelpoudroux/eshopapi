const { login, register, getRole } = require("../repository/auth");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const data = await login(email, password);

  if (data.error) {
    res.json(data);
    res.status("500");
  }

  const user = data;
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
