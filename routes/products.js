var express = require("express");
var router = express.Router();
const multer = require("multer");
const Role = require("../middleware/enum/enum");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd() + "/public/productImages"}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

// Require controller modules.
var product_Controller = require("../controllers/productController");
const authorize = require("../middleware/authorize");

/// Product ROUTES ///

// GET ALL PRODUCTS.
router.get("/", product_Controller.product_list);
router.get("/:id", product_Controller.product_detail);
router.get("/category/:category", product_Controller.product_By_Category);

router.post("/add", authorize([Role.Admin]));
router.post("/add", upload.single("upload"), product_Controller.product_create);
router.delete(
  "/:id/delete",
  authorize([Role.Admin]),
  product_Controller.product_delete
);
router.put(
  "/:id/updateProduct",
  authorize([Role.Admin]),
  product_Controller.product_updateProduct
);
router.put(
  "/isProductNewNess/:id",
  authorize([Role.Admin]),
  product_Controller.is_Product_NewNess
);

module.exports = router;
