const express = require("express");
const router = express.Router();

const {
  scanQrCode,
  validateTicket,
  bookTicket,
  ticketConfirmation,
  getMyTickets,
} = require("../controllers/qrcode");

router.route("/bookTicket").post(bookTicket);

router.route("/ticket/confirmation").get(ticketConfirmation);

router.route("/get-ticket").post(getMyTickets);

router.route("/scan").get(scanQrCode);

router.route("/validate/:ticketId").get(validateTicket);

module.exports = router;
