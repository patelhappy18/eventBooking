const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
  },
  status: {
    type: String,
    enum: ["valid", "used", "expired"],
    default: "valid",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date, // Optional: for timed expiry
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
