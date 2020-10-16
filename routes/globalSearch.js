var express = require('express');
var router = express.Router();
var globalSearchController = require('../controllers/globalSearchController');

// GET RESULT GLOBAL SEARCH.
router.get('/', globalSearchController.globalSearchResult);

module.exports = router;
