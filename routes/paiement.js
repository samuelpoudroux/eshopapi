var express = require("express");
var router = express.Router();

// Require controller modules.
var paiementController = require("../controllers/paiementController");

// router.post("/stripe/charge", paiementController.postCharge);

module.exports = router;
