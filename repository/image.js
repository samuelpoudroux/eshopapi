var MongoClient = require('mongodb').MongoClient;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({ storage: storage });

module.exports = upload;
