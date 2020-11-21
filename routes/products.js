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

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

// Require controller modules.
var product_Controller = require("../controllers/productController");
const authorize = require("../middleware/authorize");

/// Product ROUTES ///

// GET ALL PRODUCTS.
router.get("/", product_Controller.product_list);
router.get("/:id", product_Controller.product_detail);
router.get("/stockNumber/:uid", product_Controller.stockNumber);
router.get("/images/:id", product_Controller.product_images_url);
router.get("/category/:category", product_Controller.product_By_Category);

router.post("/add", authorize([Role.Admin]));
router.post("/add", upload.array("upload"), product_Controller.product_create);
router.delete(
  "/:id/delete",
  authorize([Role.Admin]),
  product_Controller.product_delete
);
router.put(
  "/:id",
  authorize([Role.Admin]),
  product_Controller.product_updateProduct
);
router.put(
  "/isProductNewNess/:id",
  authorize([Role.Admin]),
  product_Controller.is_Product_NewNess
);

module.exports = router;
