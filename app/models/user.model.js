"use strict";
const sql = require("./db");
// const { Role, RoleService } = require("./role.model");
class User {
  constructor(user) {
    this.first_name = user?.first_name;
    this.last_name = user?.last_name;
    this.username = user?.username;
    this.password = user?.password;
    this.is_active = user?.is_active;
    this.role_id = user?.role_id;
  }
}

class UserService {
  static getAll(callback) {
    let query =
      "Select u.*, r.name as role_name from users as u join roles r on u.role_id = r.id";
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
module.exports = { User, UserService };
