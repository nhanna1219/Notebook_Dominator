module.exports = (app) => {
  require("./role.route")(app);
  require("./login.route")(app);

  require("./home.route")(app);
  require("./attendance.route")(app);
  require("./notebook.route")(app);
};
