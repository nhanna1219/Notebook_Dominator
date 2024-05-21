module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Đăng nhập để được xem trang này!");
    res.redirect("/login");
  },

  forwardAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    const redirectTo = req.user.role_id === 4 ? '/role' : '/home';
    return res.redirect(redirectTo);
  },
};
 