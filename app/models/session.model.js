"use strict";
const sql = require("./db");

class Session {
  constructor(session) {
    this.name = session?.name;
    this.from_time = session?.from_time;
    this.to_time = session?.to_time;
    this.semester = session?.semester;
  }
}

class SessionService {
  static async getAll() {
    try {
      const [res] = await sql.promise().query('SELECT * FROM sessions');
      if (res.length) {
        console.log("Found:", res[0]);
        return res[0];
      } else {
        throw new Error("Schedule not found");
      }
    } catch (err) {
      console.error("Error on getSchedule by user id:", err);
      throw err;
    }
  }
}

module.exports = { Session, SessionService };
