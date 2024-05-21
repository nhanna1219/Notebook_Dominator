const router = require("express").Router();
const attendanceCtrl = require("../controllers/user/attendance.controller");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

module.exports = (app) => {
  router.get("/", attendanceCtrl.index);
  // Get classes
  router.get("/classes", attendanceCtrl.getScheduleClasses);

  // Get periods
  router.get("/periods/:id", attendanceCtrl.getSchedulePeriods);

  router.get("/students", attendanceCtrl.getScheduleStudents);

  router.post("/students", attendanceCtrl.upsert);
  
  // router.post("/students/add", attendanceCtrl.insert);
  // router.put("/students/update", attendanceCtrl.update);

  app.use("/attendance", ensureAuthenticated, router);
};
