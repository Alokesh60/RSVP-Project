const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");

router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    currentPath: "/login",
    layout: "layout",
    error: null,
  });
});

router.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Sign Up",
    currentPath: "/signup",
    layout: "layout",
    bodyClass: "bg-gray-50",
    error: null,
  });
});

router.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || password !== confirmPassword) {
    return res.render("signup", {
      title: "Sign Up",
      currentPath: "/signup",
      layout: "layout",
      error: "Invalid input or passwords don't match.",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.render("signup", {
      title: "Sign Up",
      currentPath: "/signup",
      layout: "layout",
      error: "Email already registered",
    });
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ name, email, password: hashed, role: "admin" });
  res.redirect("/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.render("login", {
      title: "Login",
      currentPath: "/login",
      layout: "layout",
      error: "User not found",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.render("login", {
      title: "Login",
      currentPath: "/login",
      layout: "layout",
      error: "Invalid credentials",
    });
  }

  req.session.user = user;
  res.redirect(user.role === "admin" ? "/attendee" : "/events");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
