const passport = require('passport');

class LoginController {
  // GET login
  getLogin(req, res) {
    if (req.isAuthenticated()) {
      const redirectTo = req.user.role_id === 4 ? '/role' : '/home';
      return res.redirect(redirectTo);
    }
    res.render('login', { errors: req.flash('errors') });
  }

  // POST login
  postLogin(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/login');
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        // Redirect based on user role
        const redirectTo = req.user.role_id === 4 ? '/role' : '/home';
        return res.redirect(redirectTo);
      });
    })(req, res, next);
  }

  // logout(req, res) {
  //   req.logout((err) => {
  //     if (err) { return next(err); }
  //     req.session.destroy(() => {
  //       res.redirect('/users/login');
  //     });
  //   });
  // }
}

module.exports = LoginController;
