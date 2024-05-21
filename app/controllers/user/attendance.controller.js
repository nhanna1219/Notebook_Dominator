"use strict";
const { Class, ClassService } = require("../../models/class.model");
const { Student, StudentService } = require("../../models/student.model");
const { Session, SessionService } = require("../../models/session.model");
const { Schedule, ScheduleService } = require("../../models/schedule.model")

class AttendanceCtrl {
  async index(req, res) {
    try {
      res.render("user/attendance/index");
    } catch (error) {
      console.error('Error rendering page:', error);
      res.status(500).send("An error occurred");
    }
  }

  async getSchedulePeriods(req, res) {
    try {
      const userId = req.user.id;
      const classId = req.params.id;
      const periods = await ScheduleService.getCurrentPeriods(userId, classId);
      res.status(200).json(periods);
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to get schedule.");
    }
  }

  async getScheduleClasses(req, res) {
    try {
      const userId = req.user.id;
      const classes = await ScheduleService.getCurrentClasses(userId);
      res.status(200).json(classes);
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to get schedule.");
    }
  }

  async getScheduleStudents(req, res) {
    try {
      const { classId, scheduleId } = req.query;
      const students = await StudentService.getCurrentStudents(classId, scheduleId);
      res.status(200).json(students);
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to get schedule.");
    }
  }

  async upsert(req, res) {
    try {
      const { records } = req.body;
      const userId = req.user.id;
      StudentService.upsert(records, userId, (error, data) => {
        if (error) {
          res.status(500).json({ error: "Something went wrong" });
        } else {
          res.status(200).json(data);
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to get schedule.");
    }
  }

  // insert(req, res) {
  //   const { insertRecords } = req.body;

  //   StudentService.insert(insertRecords, (error, data) => {
  //     if (error) {
  //       res.status(500).json({ error: "Something went wrong" });
  //     } else {
  //       res.status(200).json(data);
  //     }
  //   });
  // }

  // update(req, res) {
  //   const { updateRecords } = req.body;

  //   StudentService.update(updateRecords, (error, data) => {
  //     if (error) {
  //       res.status(500).json({ error: "Something went wrong" });
  //     } else {
  //       res.status(200).json(data);
  //     }
  //   });
  // }
}

module.exports = new AttendanceCtrl();
