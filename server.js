const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const app = express();

// ========== MIDDLEWARE SETUP ==========
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cors());

// ========== SESSION SETUP ==========
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// ========== STATIC FILES ==========
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("public/uploads"));

// ========== EJS + LAYOUT SETUP ==========
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// ========== GLOBAL TEMPLATE VARIABLE ==========
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ========== ROUTES ==========
const authRoutes = require("./routes/auth");
const rsvpRoutes = require("./routes/rsvp");
const eventRoutes = require("./routes/events");
const adminRoutes = require("./routes/attendee");

app.use(authRoutes);
app.use("/rsvp", rsvpRoutes);
app.use("/", eventRoutes);
app.use(adminRoutes);

// ========== DIRECT ROUTES ==========
app.get("/create-event", (req, res) => {
  res.render("createEvent", {
    title: "Create Event",
    currentPath: "/create-event",
    bodyClass: "font-inter bg-gray-50",
  });
});

app.get("/attendee", (req, res) => {
  res.render("attendee", {
    title: "Attendees",
    currentPath: "/attendee",
    bodyClass: "font-inter bg-gray-50",
  });
});

app.get("/event-detail", (req, res) => {
  res.render("event-detail", {
    title: "Event Details",
    bodyClass:
      "font-inter bg-gradient-to-br from-indigo-50 via-white to-indigo-100",
  });
});

// ========== DEFAULT ROUTE ==========
app.get("/", (req, res) => {
  res.redirect("/events");
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running: http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection failed:", err));
