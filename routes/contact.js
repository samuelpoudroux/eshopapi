var express = require("express");
var router = express.Router();

// Require controller modules.
var contact_Controller = require("../controllers/contactController");

router.post("/email", contact_Controller.sendEmail);

module.exports = router;
