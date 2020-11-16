var express = require("express");
var router = express.Router();

// Require controller modules.
var userController = require("../controllers/userController");

router.get("/:id", userController.user_detail);
router.put("/:id", userController.updateUser);
router.put("/resetPassword/:id", userController.reset_password);

module.exports = router;
