const { sendEmail } = require("../repository/contact");

exports.sendEmail = async (req, res) => {
  try {
    const { body } = req;

    const emailIsSend = await sendEmail(body);
    const { errors } = emailIsSend;
    if (errors) {
      res.json(emailIsSend);
      res.status("400");
    } else {
      res.status("200");
      res.json(emailIsSend);
    }
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de l'envoie de l'email, ${error}`);
  }
};
