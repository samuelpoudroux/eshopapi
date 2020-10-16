var express = require('express');
var router = express.Router();

// Require controller modules.
var auth_Controller = require('../controllers/authController');

/// Product ROUTES ///

router.post('/login', auth_Controller.login);
router.post('/register', auth_Controller.register);

module.exports = router;
