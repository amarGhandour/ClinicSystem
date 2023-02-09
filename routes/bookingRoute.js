const express = require('express');
const bookingController = require("../controllers/bookingController");
const {authorize} = require("../middlewares/authMW");
const {idValidation, paymentCashValidation} = require("../middlewares/dataValidator");
const router = express.Router();

router.post('/checkout_payment/:id', idValidation, bookingController.pay);
router.post('/cash_payment', authorize('admin', 'employee'), paymentCashValidation, bookingController.payCash);

module.exports = router;