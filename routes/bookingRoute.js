const express = require('express');
const bookingController = require("../controllers/bookingController");
const router = express.Router();

router.post('/checkout_payment/:doctorId', bookingController.pay);
router.post('/cash_payment/:doctorId', bookingController.payCash);

module.exports = router;