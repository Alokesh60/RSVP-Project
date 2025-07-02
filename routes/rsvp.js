const express = require("express");
const router = express.Router();
const Attendee = require("../models/Attendee");

//POST /rsvp - Save new RSVP
router.post("/", async (req, res) => {
  try {
    const { name, email, session } = req.body;

    if (!name || !email || !session) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAttendee = new Attendee({ name, email, session });
    await newAttendee.save();

    res.status(201).json({ message: "RSVP saved", attendee: newAttendee });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//GET /rsvp - Fetch all RSVPs
router.get("/", async (req, res) => {
  try {
    const attendees = await Attendee.find().sort({ rsvpAt: -1 });
    res.status(200).json(attendees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
