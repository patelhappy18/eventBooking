const express = require("express");
const router = express.Router();

const {
  scanQrCode,
  validateTicket,
  bookTicket,
} = require("../controllers/qrcode");

router.route("/bookTicket").post(bookTicket);

router.route("/scan").get(scanQrCode);

router.route("/validate/:ticketId").get(validateTicket);

module.exports = router;
