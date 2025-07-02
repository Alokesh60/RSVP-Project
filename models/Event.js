const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  coverImage: String,
  eventName: String,
  description: String,
  eventType: String,
  startTime: String,
  endTime: String,
  eventDate: {
    type: Date,
    required: true,
  },
  venue: String,
});

module.exports = mongoose.model("Event", eventSchema);
