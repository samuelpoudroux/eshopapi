var nodemailer = require("nodemailer");
const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD } = process.env;

var transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: true, // use SSL
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

module.exports = transporter;
