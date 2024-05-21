"use strict";
const sql = require("./db");
class Subject {
  constructor(subject) {
    this.title = subject?.title;
    this.is_active = subject?.is_active;
  }
}

class SubjectService {
  static async getSubjects() {
    try {
      const [res] = await sql.promise().query("SELECT * FROM subjects");
      if (res.length) {
        console.log("Found:", res);
        return res;
      } else {
        throw new Error("Subject not found");
      }
    } catch (err) {
      console.error("Error on getSubjects():", err);
      throw err; // Rethrow to allow caller to handle
    }
  }
}

module.exports = { Subject, SubjectService };
