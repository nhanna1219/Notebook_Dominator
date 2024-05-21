const router = require("express").Router();
const notebookController = require("../controllers/user/notebook.controller");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

module.exports = (app) => {
  router.get("/", notebookController.index);

  app.use("/notebook", ensureAuthenticated, router);
};