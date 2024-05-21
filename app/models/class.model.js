"use strict";
const sql = require("./db");

class Class {
  constructor(_class) {
    this.name = _class?.first_name;
    this.is_active = _class?.is_active;
    this.grade_id = _class?.grade_id;
  }
}

class ClassService {
  static getAll(callback) {
    let query = `SELECT * FROM classes`;

    sql.query(query, (err, res) => {
      if (err) {
        console.log(err);
        callback(null, err);

        return;
      }

      console.log(res);
      callback(null, res);
    });
  }
}

module.exports = { Class, ClassService };
