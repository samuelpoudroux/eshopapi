var express = require('express');
var router = express.Router();

// Require controller modules.
var image_Controller = require('../controllers/imageController');

router.post('/', image_Controller.load);

module.exports = router;
