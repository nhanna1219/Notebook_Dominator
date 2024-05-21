"use strict";
const sql = require("./db");

class Schedule {
  constructor(schedule) {
    this.id = schedule?.name;
    this.periodId = schedule?.period_id;
    this.week = schedule?.week_of_semester;
    this.dow = schedule?.day_of_week;
    this.date = schedule?.date;
    this.semester = schedule?.semester;
    this.classId = schedule?.class_id;
    this.teacherId = schedule?.teacher_id;
  }
}

class ScheduleService {
    static async getCurrentClasses(userId) {
        try {
            const [res] = await sql.promise().query(`
                SELECT DISTINCT c.id, c.name className
                FROM
                    schedules s
                    JOIN classes c ON s.class_id = c.id
                WHERE
                    s.teacher_id = ?
                    AND s.date = CURRENT_DATE()
                ORDER BY c.name;`
                , userId
            );
            if (res.length) {
                console.log("Found:", res);
                return res;
            } else {
                throw new Error("Class schedule not found");
            }
        } catch (err) {
            console.error("Error on getSchedule by user id:", err);
            throw err;
        }
    }

    static async getCurrentPeriods(userId, classId) {
        try {
            let checkRoleQuery = `
                SELECT homeroom_teacher_id
                FROM
                    classes c
                    JOIN users u ON u.id = homeroom_teacher_id
                WHERE
                    c.id = ?;
            `;
            const [res1] = await sql.promise().query(checkRoleQuery, [classId]);
            if (res1.length) {
                console.log(res1[0].homeroom_teacher_id )
                let includedUserQuery = userId === res1[0].homeroom_teacher_id ? "" : `AND u.id = ${userId}` ;
                let periodQuery = `
                SELECT p.id, p.note period, s.date, s.id as scheduleId
                    FROM
                        schedules s
                        JOIN classes c ON s.class_id = c.id
                        JOIN users u ON u.id = s.teacher_id
                        JOIN periods p ON p.id = s.period_id
                    WHERE 
                    c.id = ? ${includedUserQuery} AND s.date = CURRENT_DATE()
                    ORDER BY s.id, c.name, p.note;
                `;
                const [res2] = await sql.promise().query(periodQuery, [classId]);
                if (res2.length) {
                    console.log("Found:", res2);
                    return res2;
                }
                else {
                    throw new Error("Periods schedule not found");
                }
            }
            else {
                throw new Error("User Role not found");
            }
        } catch (err) {
            console.error("Error on getSchedule by user id:", err);
            throw err;
        }
    }
}

module.exports = { Schedule, ScheduleService };
