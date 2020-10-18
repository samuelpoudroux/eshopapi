var express = require('express');
var router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd() + '/public/productImages'}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

// Require controller modules.
var product_Controller = require('../controllers/productController');

/// Product ROUTES ///

// GET ALL PRODUCTS.
router.get('/', product_Controller.product_list);
router.get('/:id', product_Controller.product_detail);
router.post('/add', upload.single('upload'), product_Controller.product_create);
router.delete('/:id/delete', product_Controller.product_delete);
router.put('/:id/updateProduct', product_Controller.product_updateProduct);

module.exports = router;
