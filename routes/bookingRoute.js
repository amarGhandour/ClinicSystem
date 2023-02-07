const express = require('express');
const bookingController = require("../controllers/bookingController");
const router = express.Router();

router.post('/checkout_payment/:doctorId', bookingController.pay);

module.exports = router;