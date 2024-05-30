"use strict";
const { Schedule, ScheduleService } = require("../../models/schedule.model");
const { Lesson, LessonService } = require("../../models/lesson.model");
const { Notebook, NotebookService } = require("../../models/notebook.model");


class NotebookController {
    async index(req, res) {
        try {
            res.render("user/notebook/index");
        } catch (error) {
            console.error('Error rendering page:', error);
            res.status(500).send("An error occurred");
        }
    }

    async getSchedulePeriods(req, res) {
        try {
            const userId = req.user.id;
            const classId = req.params.id;
            const periods = await ScheduleService.getCurrentPeriods(userId, classId, false);
            res.status(200).json(periods);
        } catch (err) {
            console.error(err);
            res.status(500).send("Failed to get schedule.");
        }
    }

    async getScheduleClasses(req, res) {
        try {
            const userId = req.user.id;
            const roleId = req.user.role_id;
            const isTrackHistory = req.body.isTrackHistory;
            const classes = await ScheduleService.getCurrentClasses(userId, roleId, isTrackHistory);
            res.status(200).json({ classes, roleId });
        } catch (err) {
            console.error(err);
            res.status(500).send("Failed to get schedule.");
        }
    }

    async getScheduleLesson(req, res) {
        try {
            const userId = req.user.id;
            const classes = await LessonService.getTeachersLesson(userId);
            res.status(200).json(classes);
        } catch (err) {
            console.error(err);
            res.status(500).send("Failed to get schedule.");
        }
    }

    async getScheduleWeek(req, res) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const [currentWeek, week] = await Promise.all([
                ScheduleService.getCurrentWeek(today),
                ScheduleService.getWeek()
            ]);
            res.status(200).json({currentWeek, week});
        } catch (err) {
            console.error(err);
            res.status(500).send("Failed to get schedule")
        }
    }

    async takeNote(req, res) {
        try {
            const noteInfo = req.body;
            const noteArray = [
                [
                    noteInfo.note,
                    noteInfo.point,
                    noteInfo.lesson_id,
                    noteInfo.schedule_id
                ]
            ];
            const insertedRow = await NotebookService.insertNote(noteArray);
            if (insertedRow > 0) {
                res.status(200).json({ message: "Take note successfully." });
            } else {
                res.status(400).json({ message: "Failed to take note." });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Failed to take note.");
        }
    }

    async getNote(req, res) {
        try {
            const userId = req.user.id;
            const userRole = req.user.role_id;
            const userSubject = req.user.subject_id;
            const classId = req.body.classId;
            const week = req.body.week;
            const notes = await NotebookService.getNote(userId, userRole, userSubject, classId, week);
            if (!notes) {
                return res.status(200).json({ message: 'Notes not found' });
            }
            res.status(200).json({notes, message: 'Found'});
        } catch (error) {
            console.error("Error on getNote", error);
            res.status(500).send("Failed to get note.");
        }
    }
}

module.exports = new NotebookController();
