const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");
const Ticket = require("../models/ticket"); // adjust path as needed

let bookings = []; // In-memory for now; use DB for real use

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

    req.session.latestBooking = { name, tickets: ticketList };
    res.json({ redirectUrl: "users/ticket/confirmation" });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).send("An error occurred while booking.");
  }
};

const validateTicket = async (req, res) => {
  const id = req.params.ticketId;
  const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });
  if (!ticket) {
    return res.redirect(`/admin/scanner?msg=❌ Invalid Ticket&type=error`);
  }

  if (ticket.status === "used") {
    return res.redirect(`/admin/scanner?msg=⚠️ Already Used&type=warning`);
  }

  ticket.status = "used";
  await ticket.save();

  return res.redirect(`/admin/scanner?msg=✅ Ticket Validated&type=success`);
};

const ticketConfirmation = async (req, res) => {
  const booking = req.session.latestBooking;
  if (!booking) return res.status(400).send("No recent booking found");

  res.render("ticket", {
    name: booking.name,
    tickets: booking.tickets,
  });
};

const getMyTickets = async (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).send("Please provide either email or phone.");
  }

  try {
    const query = [];

    if (email) query.push({ email: email.trim().toLowerCase() });
    if (phone) query.push({ phone: phone.trim() });

    const tickets = await Ticket.find({ $or: query });
    console.log(tickets);

    if (tickets.length === 0) {
      return res.render("no-tickets", { message: "No tickets found." });
    }

    const qrTicketList = await Promise.all(
      tickets.map(async (t) => ({
        ticketId: t.ticketId,
        qrCode: await QRCode.toDataURL(t.ticketId),
      }))
    );

    res.render("ticket", {
      name: tickets[0].name,
      tickets: qrTicketList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  validateTicket,
  bookTicket,
  ticketConfirmation,
  getMyTickets,
};
