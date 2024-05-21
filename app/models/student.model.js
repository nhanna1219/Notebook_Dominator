"use strict";
const sql = require("./db");

class Student {
	constructor(student) {
		this.first_name = student?.first_name;
		this.last_name = student?.last_name;
		this.is_active = student?.is_active;
		this.class_id = student?.class_id;
	}
}

class StudentService {
	static async getCurrentStudents(classId, scheduleId) {
		try {
			let query = `
				SELECT s.id, s.student_id, s.first_name, s.last_name, ss.note, ss.is_present is_present, ss.is_present is_permitted
				FROM
						students s
						LEFT JOIN (
								SELECT
										student_id,
										note,
										is_present,
										schedule_id
								FROM student_attendance
								WHERE
										schedule_id = ?
						) ss ON s.id = ss.student_id
						LEFT JOIN schedules sc ON ss.schedule_id = sc.id
				WHERE
						s.class_id = ?;`;

			const [res] = await sql.promise().query(query, [scheduleId, classId]);
			if (res && res.length) {
				console.log("Found:", res);
				return res;
			} else {
				throw new Error("Students schedule not found");
			}
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	static async upsert(records, userId, callback) {
		try {
			let getSeesionQuery = `
			SELECT p.session_id
			FROM schedules s
			JOIN periods p ON s.period_id = p.id
			WHERE s.id = ?;
			`;

			let getCurrentClassSchedule = `
			SELECT s.id FROM schedules s
			JOIN periods p ON s.period_id = p.id 
			WHERE 
				class_id = ?
				AND date = CURRENT_DATE
				AND p.session_id = ?;
			`;

			let checkRoleQuery = `
			SELECT homeroom_teacher_id
			FROM
				classes c
				JOIN users u ON u.id = homeroom_teacher_id
			WHERE
				c.id = ?;
			`;
			const [res3] = await sql.promise().query(getSeesionQuery, [records[0].schedule_id]);
			if (res3.length) {
				let sessionId = res3[0].session_id;
				const [[res1], [res2]] = await Promise.all([
					sql.promise().query(checkRoleQuery, [records[0].classId]),
					sql.promise().query(getCurrentClassSchedule, [records[0].classId, sessionId])
				]);
				if (res1.length && res2.length) {
					let isHomeroomTeacher = userId === res1[0].homeroom_teacher_id;
					let insertQuery = `INSERT INTO student_attendance (note, is_present, student_id, schedule_id) VALUES `;
					let values = "";
					if (isHomeroomTeacher) {
						res2.forEach(function (schedule, index) {
							values += records.map((record, index) => {
								const note = record.note ? `"${record.note.replace(/"/g, '\\"')}"` : '""';
								return `(${note}, ${record.is_present}, ${record.id}, ${schedule.id})`;
							}).join(", ");
							values += (index + 1 === res2.length) ? "" : ", ";
						});
					} else {
						values = records.map((record, index) => {
							const note = record.note ? `"${record.note.replace(/"/g, '\\"')}"` : '""';
							return `(${note}, ${record.is_present}, ${record.id}, ${record.schedule_id})`;
						}).join(", ");
					}
					insertQuery += values;
					insertQuery += ` ON DUPLICATE KEY UPDATE 
								note = VALUES(note),
								is_present = VALUES(is_present)`;
					console.log(insertQuery);

					const [res] = await sql.promise().query(insertQuery);
					console.log("Number of records inserted or updated: " + res.affectedRows);
					callback(null, { message: "Upserted successfully" });
				}
			}
		} catch (err) {
			console.log("Error:", err);
			callback(err, null);
		}
	}
}

module.exports = { Student, StudentService };
