const router = require("express").Router();
const notebookController = require("../controllers/user/notebook.controller");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

module.exports = (app) => {
  router.get("/", notebookController.index);

  // Get classes
  router.get("/classes", notebookController.getScheduleClasses);

  // Get periods
  router.get("/periods/:id", notebookController.getSchedulePeriods);

  // Get lessons
  router.get("/lessons", notebookController.getScheduleLesson);

  // Create new Note
  router.post("/note", notebookController.takeNote);

  // Get class for tracking 
  router.post("/history/class", notebookController.getScheduleClasses)

  // Get current week for tracking 
  router.get("/history/week", notebookController.getScheduleWeek);

  router.post("/history/note", notebookController.getNote)

  app.use("/notebook", ensureAuthenticated, router);
};