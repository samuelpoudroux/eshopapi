var express = require("express");
var router = express.Router();

// Require controller modules.
var order = require("../controllers/orderController");

router.get("/", order.list);
router.get("/ongoingOrders/:userId", order.detailOngoingOrders);
router.get("/historyOrders/:userId", order.detailHistoryOrders);
router.post("/:userId", order.create);

module.exports = router;
