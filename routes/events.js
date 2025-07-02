const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Event = require("../models/Event");
const Attendee = require("../models/Attendee");

const requireAuth = require("../Middleware/requireAuth");

//post registration
router.post("/register-event/:id", async (req, res) => {
  const { name, email } = req.body;
  const eventId = req.params.id;

  try {
    const alreadyRegistered = await Attendee.findOne({
      event: eventId,
      email,
    });

    req.session.email = email;

    if (!alreadyRegistered) {
      await Attendee.create({
        name,
        email,
        event: eventId,
        status: "Registered",
      });

      req.session.successMessage = "You have successfully registered!";
      req.session.isRegistered = true;
    } else {
      req.session.successMessage = null;
      req.session.isRegistered = true;
    }

    res.redirect(`/events/${eventId}`);
  } catch (err) {
    console.error("Error registering:", err);
    res.status(500).send("Registration failed");
  }
});

//event details
router.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    let isRegistered = false;
    let successMessage = null;

    if (req.session.email) {
      const existing = await Attendee.findOne({
        eventId: req.params.id,
        email: req.session.email,
      });

      if (existing) {
        isRegistered = true;
        successMessage = req.session.successMessage || null;
      }
    }

    req.session.successMessage = null;

    res.render("event-detail", {
      title: event.eventName,
      currentPath: "/events",
      bodyClass:
        "font-inter bg-gradient-to-br from-indigo-50 via-white to-indigo-100",
      event,
      isRegistered,
      successMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: -1 });
    res.render("events", {
      title: "All Events",
      currentPath: "/events",
      events,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading events");
  }
});

//Set storage Engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// GET: Render Create Event page
router.get("/create-event", (req, res) => {
  res.render("createEvent", {
    title: "Create Event",
    currentPath: "/create-event",
    bodyClass: "font-inter bg-gradient-to-br from-gray-50 to-gray-100",
  });
});

//post route
router.post("/create-event", upload.single("coverImage"), async (req, res) => {
  const {
    eventName,
    description,
    eventType,
    startTime,
    endTime,
    eventDate,
    venue,
  } = req.body;

  const coverImagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newEvent = new Event({
      eventName,
      description,
      eventType,
      startTime,
      endTime,
      eventDate: new Date(eventDate),
      venue,
      coverImage: coverImagePath,
    });

    await newEvent.save();
    res.redirect("/events");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving event");
  }
});

module.exports = router;
