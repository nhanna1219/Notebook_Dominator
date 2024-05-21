const LocalStrategy = require("passport-local").Strategy;
const { UserService } = require("../models/user.model");

module.exports = function (passport) {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
    async function (req, username, password, done) {
      try {
        const status = await UserService.login(username, password);
        switch (status) {
          case -1:
            return done(null, false, req.flash('errors', 'Tài khoản không tồn tại, vui lòng liên hệ quản trị viên!'));
          case 0:
            return done(null, false, req.flash('errors', 'Sai tên đăng nhập hoặc mật khẩu, vui lòng kiểm tra lại!'));
          default:
            break;
        }
        const user = status;
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserService.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
