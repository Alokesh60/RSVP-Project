const express = require("express");
const router = express.Router();
const Attendee = require("../models/Attendee");

const requireAuth = require("../Middleware/requireAuth");
//Delete Attendee
router.delete("/attendee/:id", async (req, res) => {
  try {
    await Attendee.findByIdAndDelete(req.params.id);
    res.redirect("/attendee");
  } catch (err) {
    console.log("Error deleting attendee:", err);
    res.status(500).send("Failed to delete attendee");
  }
});

router.get("/attendee", requireAuth("admin"), async (req, res) => {
  try {
    const attendees = await Attendee.find()
      .populate("event")
      .sort({ createdAt: -1 });

    res.render("attendee", {
      title: "Attendees",
      currentPath: "/attendee",
      bodyClass:
        "bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-5 text-gray-800",
      attendees,
    });
  } catch (err) {
    console.error("Failed to load attendees:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
