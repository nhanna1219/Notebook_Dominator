"use strict";
const sql = require("./db");

class Schedule {
    constructor(schedule) {
        this.id = schedule?.id;
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
    static async getCurrentClasses(userId, userRole, isTrackHistory = false) {
        try {
            let includeQuery = '';
            if (isTrackHistory) {
                includeQuery += userRole === 3 ? `` : (userRole === 4 ? ``: `WHERE s.teacher_id = ${userId} `); 
            } else {
                includeQuery += `WHERE s.date = CURRENT_DATE() AND s.teacher_id = ${userId} `;
            }
            
            const [res] = await sql.promise().query(`
                SELECT DISTINCT c.id, c.name className, c.homeroom_teacher_id
                FROM
                    schedules s
                    JOIN classes c ON s.class_id = c.id
                ${includeQuery}
                ORDER BY c.name;`
            );
            console.log("Found:", res);
            if (isTrackHistory){
                res.forEach(resObj => {
                    resObj.isHomeroomTeacher = resObj.homeroom_teacher_id === userId;
                    if (resObj.isHomeroomTeacher) {
                        resObj.className = `${resObj.className} (Lớp chủ nhiệm)`;
                    }
                });
            }
            
            return res;
        } catch (err) {
            console.error("Error on getSchedule by user id:", err);
            throw err;
        }
    }

    static async getCurrentPeriods(userId, classId, isAttendanceFeature = true) {
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
                console.log(res1[0].homeroom_teacher_id)
                let includedUserQuery = isAttendanceFeature ? (userId === res1[0].homeroom_teacher_id ? "" : `AND u.id = ${userId} `) : `AND u.id = ${userId}`;
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
    static async getCurrentWeek(today) {
        try {
            const [rows] = await sql.promise().query(`
                SELECT week_of_semester
                FROM schedules
                WHERE
                    date = ?
                `,
                [today]);

            if (rows.length > 0) {
                console.log(`We are currently in week: ${rows[0].week_of_semester}`);
                return rows[0].week_of_semester;
            } else {
                console.log('No matching date found in the schedule.');
                return null;
            }

        } catch (err) {
            console.error("Failed to get current week:", err);
            throw err;
        }
    }

    static async getWeek() {
        try {
            const [rows] = await sql.promise().query(`
                SELECT date, week_of_semester
                FROM schedules
                GROUP BY
                    date, week_of_semester
                `);

            if (rows.length > 0) {
                return rows;
            }
        } catch (err) {
            console.error("Failed to get week:", err);
            throw err;
        }
    }
}

module.exports = { Schedule, ScheduleService };
