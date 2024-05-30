"use strict";
const sql = require("./db");

class Lesson {
  constructor(lesson) {

  }
}

class LessonService {
    static async getTeachersLesson(teacherId) {
        try {
            const [res] = await sql.promise().query(`
                SELECT l.id, title, description, l.subject_id 
                FROM lessons l
                    JOIN users u ON l.subject_id = u.subject_id
                WHERE u.id = ?`
                , teacherId
            );
            console.log("Found:", res);
            return res;
        } catch (err) {
            console.error("Error on getTeachersLesson by user id:", err);
            throw err;
        }
    }

}

module.exports = { Lesson, LessonService };
