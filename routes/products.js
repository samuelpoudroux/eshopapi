var express = require("express");
var router = express.Router();
const multer = require("multer");
const Role = require("../middleware/enum/enum");
const sharp = require("sharp");
const fs = require("fs");

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

const uploadFiles = upload.array("upload");

const uploadImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        // Too many images exceeding the allowed limit
        // ...
      }
    } else if (err) {
      console.log("");
    }

    // Everything is ok.
    next();
  });
};

const resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async (file) => {
      const newFilename = file.originalname;
      sharp(file.path)
        .resize({ height: 500 })
        .toBuffer(`${file.originalname}`)
        .then((data) => {
          fs.writeFileSync(
            `${process.cwd() + "/public/productImages/" + file.originalname}`,
            data
          );
        })
        .catch((err) => {
          console.log("err", err);
        });

      req.body.images.push(newFilename);
    })
  );

  next();
};

// Require controller modules.
var product_Controller = require("../controllers/productController");
const authorize = require("../middleware/authorize");

/// Product ROUTES ///

// GET ALL PRODUCTS.
router.get("/", product_Controller.product_list);
router.get("/:uid", product_Controller.product_detail);
router.get("/stockNumber/:uid", product_Controller.stockNumber);
router.get("/images/:id", product_Controller.product_images_url);
router.get("/category/:category", product_Controller.product_By_Category);

router.post("/add", authorize([Role.Admin]));
router.post(
  "/add",
  uploadImages,
  resizeImages,
  product_Controller.product_create
);
router.post(
  "/notation/:userId/:productId",
  product_Controller.create_product_notation
);
router.get("/notation/:productId", product_Controller.get_product_notations);
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
  "/isProductNewNess/uid",
  authorize([Role.Admin]),
  product_Controller.is_Product_NewNess
);

module.exports = router;
