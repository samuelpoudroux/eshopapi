var express = require("express");
var router = express.Router();

const multer = require("multer");
const Role = require("../middleware/enum/enum");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd() + "/public/categoryImages"}`);
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
var categoryController = require("../controllers/categoryController");
const authorize = require("../middleware/authorize");

/// category CONTROLLER ///

router.get("/", categoryController.categories_list);
router.get("/:id", categoryController.category_detail);
router.post("/create", authorize([Role.Admin]));
router.post(
  "/create",
  upload.single("upload"),
  categoryController.category_create
);

module.exports = router;
