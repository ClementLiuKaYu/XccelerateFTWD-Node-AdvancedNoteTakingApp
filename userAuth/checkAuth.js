const checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.redirect("/login");
};

const checkNotLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
    return;
  }
  next();
  return;
};

module.exports = {
  checkLoggedIn,
  checkNotLoggedIn,
};
