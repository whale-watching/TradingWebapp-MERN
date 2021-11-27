const express = require("express");
const router = express.Router();
const { order } = require("../src/api");

// for guest and logged in user
router.put("/checkPrevOrders", order.checkPrevOrder);


// for a logged in user
router.post("/orderCompleted", order.orderCompleted); //  if one order was completed
router.post("/orderCreated", order.orderCreated);


module.exports = router;