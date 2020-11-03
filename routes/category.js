var express = require("express");
var router = express.Router();

// Require controller modules.
var categoryController = require("../controllers/categoryController");
const authorize = require("../middleware/authorize");

/// category CONTROLLER ///

router.get("/", categoryController.categories_list);

module.exports = router;
