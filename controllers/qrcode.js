const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");
const Ticket = require("../models/ticket"); // adjust path as needed

let bookings = []; // In-memory for now; use DB for real use

const scanQrCode = async (req, res) => {
  res.render("scan"); // shows the scanner page
};

const bookTicket = async (req, res) => {
  const { name, email, phone, ticketCount } = req.body;
  const count = parseInt(ticketCount) || 1;

  if (count < 1 || count > 5) {
    return res.status(400).send("You can book 1 to 5 tickets at a time.");
  }

  const ticketList = [];

  try {
    for (let i = 0; i < count; i++) {
      const ticketId = uuidv4();
      const qrCode = await QRCode.toDataURL(ticketId);

      // Save ticket in MongoDB
      const ticket = await Ticket.create({
        ticketId,
        name,
        email,
        phone,
      });

      ticketList.push({
        ticketId,
        qrCode,
      });
    }

    // Render all tickets
    res.render("ticket", {
      name,
      tickets: ticketList,
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).send("An error occurred while booking.");
  }
};

const validateTicket = async (req, res) => {
  const id = req.params.ticketId;
  const ticket = bookings.find((t) => t.id === id);

  if (!ticket) return res.send("❌ Invalid Ticket");
  if (ticket.status === "used") return res.send("⚠️ Already Used");

  ticket.status = "used";
  return res.send("✅ Ticket Validated");
};

module.exports = {
  scanQrCode,
  validateTicket,
  bookTicket,
};
