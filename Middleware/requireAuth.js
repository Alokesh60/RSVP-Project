module.exports = (role) => {
  return (req, res, next) => {
    if (!req.session.user) return res.redirect("/login");

    if (role && req.session.user.role !== role) {
      return res.status(403).send("Unauthorized");
    }

    next();
  };
};
