"use strict";
const sql = require("./db");

const { User, UserService } = require('../models/user.model');

class Notebook {
    constructor(notebook) {

    }
}

class NotebookService {
    static async insertNote(noteInfo) {
        try {
            const [res] = await sql.promise().query(`
                INSERT INTO notebooks (note, point, lesson_id, schedule_id) VALUES (?)
                `
                , noteInfo
            );

            return res.affectedRows;
        } catch (err) {
            console.error("Error on getSchedule by user id:", err);
            throw err;
        }
    }

    static async getNote(userId, userRole, userSubject, classId, week) {
        try {
            let includedQuery = '';
            const homeroomTeacherClassId = await UserService.getClassOfHomeroomTeacher(userId);

            if (userRole === 1 && homeroomTeacherClassId === classId) { // Is Homeroom Teacher and this is their class
                includedQuery = `S.teacher_id = ${userId} `;
            } else if (userRole === 3) { // Is Head of Department Teacher
                includedQuery = `SBJ.id = ${userSubject} `;
            } else if (userRole === 2) {
                includedQuery = `S.teacher_id = ${userId} `;
            }
            if (classId) {
                includedQuery += includedQuery.length ? `AND S.class_id = ${classId} ` : `S.class_id = ${classId} `;
            }

            if (week) {
                includedQuery += `AND S.week_of_semester = ${week}`;
            }
            
            let query = `
                SELECT
                    SBJ.title AS subjectName,
                    L.title AS lessonName,
                    N.note,
                    N.point,
                    CL.name AS className,
                    CONCAT(
                        U.last_name,
                        ' ',
                        U.first_name
                    ) AS teacherName,
                    N.created_at,
                    N.updated_at,
                    S.day_of_week,
                    P.id AS periodId
                FROM
                    notebooks N
                    JOIN schedules S ON N.schedule_id = S.id
                    JOIN periods P ON P.id = S.period_id
                    JOIN classes CL ON S.class_id = CL.id
                    JOIN users U ON U.id = S.teacher_id
                    JOIN lessons L ON L.id = N.lesson_id
                    JOIN subjects SBJ ON SBJ.id = L.subject_id
                WHERE
                    ${includedQuery};
            `;
            const [res] = await sql.promise().query(query);
            if (res.length) {
                console.log(res);
                return res;
            }
        } catch (err) {
            throw err;
        }
    }

}

module.exports = { Notebook: Notebook, NotebookService: NotebookService };
