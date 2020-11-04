const fs = require("fs");
var handlebars = require("handlebars");
const { promisify } = require("util");
const transporter = require("./transporteurConfig");
const readFile = promisify(fs.readFile);

const wrapedSendMail = async (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve({ errors: error }); // or use rejcet(false) but then you will have to handle errors
      } else {
        resolve({ message: "Email envoyé avec succés" });
      }
    });
  });
};

const sendEmail = async (body) => {
  const { email, senderEmail, senderPhone, senderName, subject } = body;
  const htmlFile = await readFile(
    `${process.cwd() + "/templates/mail.html"}`,
    "utf8"
  );

  var template = handlebars.compile(htmlFile);
  var replacements = {
    senderName,
    email,
    senderEmail,
    senderPhone,
  };
  var htmlToSend = template(replacements);
  var mailOptions = {
    from: senderEmail,
    to: process.env.MAIL_USER,
    subject: subject,
    html: htmlToSend,
  };
  const res = await wrapedSendMail(mailOptions);
  return res;
};

module.exports = {
  sendEmail,
};
